package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.l8z.jparepository.OrgsJpaRepository;
import com.l8z.orgs.Channels;
import com.l8z.orgs.Instances;
import com.l8z.orgs.Members;
import com.l8z.orgs.MembersStatus;
import com.l8z.orgs.Orgs;
import com.l8z.orgs.Sql;


@Controller
public class ChatController {
	@Autowired
	private OrgsJpaRepository orgsjpa;
	// Used to Read a JSON Document and Convert to Object
	private ObjectMapper json_mapper = new ObjectMapper();
	// Static Map to Keep Status of Users
	public static HashMap<String, String> online_users = new HashMap<String, String>();
	
	// Group Chatting
    @MessageMapping("/send_message/{org_id}/{channel_title}/{instance_title}")
    @SendTo("/group/{org_id}/{channel_title}/{instance_title}")
    public ChatMessage send_message(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title,
    		@Payload ChatMessage chat_message
    	) {
    	// Log the Message with the URL
    	log_to_stdout("send_message", org_id, channel_title, instance_title);

    	// If the Message Received WAS a CHAT Message, Save it
    	if(chat_message.get_type() == ChatMessage.MessageType.CHAT) {
        	try {
        		// Convert to Orgs Object
    			Orgs temp_org = json_mapper.readValue(orgsjpa.getByOrgId(org_id).get_data(), Orgs.class);
    			// Retrieve the Channel that's being Modified
    			Channels temp_channel = temp_org.retrieve_channel(channel_title);
    			// Retrieve the Instance that's being Modified
    			Instances temp_instance = temp_channel.retrieve_instance(instance_title);
    			
    			// Remove the Channel from Orgs
    			temp_org.remove_channel(temp_channel);
    			// Remove the Instance from the Channel
    			temp_channel.remove_instance(temp_instance);
    			
    			// Add the New Message to the Instance
    			temp_instance.add_message(chat_message);
    			// Add the Instance Back to the Channel
    			temp_channel.add_instance(temp_instance);
    			
    			// Add the Channel Back to the Orgs
    			temp_org.add_channel(temp_channel);
    			
    			// Save to Database
    			Sql sql = new Sql(org_id, json_mapper.writeValueAsString(temp_org));
    			orgsjpa.save(sql);
    		} catch (JsonMappingException e) {
    			System.out.println("System - Error Updating Database");
    		} catch (JsonProcessingException e) {
    			System.out.println("System - Error Updating Database");
    		}
    	}
    	
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
        return chat_message;
    }

    @MessageMapping("/existing_user/{org_id}/{channel_title}/{instance_title}")
    @SendTo("/group/{org_id}/{channel_title}/{instance_title}")
    public ChatMessage existing_user(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title,    		
    		@Payload ChatMessage chat_message, 
    		SimpMessageHeaderAccessor header_accessor
    	) {
    	// Log the Message with the URL
    	log_to_stdout("existing_user", org_id, channel_title, instance_title);
    	
    	// Add user in Web Socket Session
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
    	header_accessor.getSessionAttributes().put("username", chat_message.get_sender());
    	header_accessor.getSessionAttributes().put("url", org_id+"/"+channel_title+"/"+instance_title);
    	
    	online_users.put(chat_message.get_sender(), "online");
    	
        return chat_message;
    }
    
    // Group History Loading
    @MessageMapping("/fetch_history/{org_id}/{channel_title}/{instance_title}")
    @SendTo("/group/history/{org_id}/{channel_title}/{instance_title}")
    public List<ChatMessage> fetch_history(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title
    	) {
    	// Log the Message with the URL
    	log_to_stdout("fetch_history", org_id, channel_title, instance_title);
    	List<ChatMessage> old_messages = null;

    	try {
    		// Convert to Orgs Object
			Orgs temp_org = json_mapper.readValue(orgsjpa.getByOrgId(org_id).get_data(), Orgs.class);
			// Retrieve the Channel -> Instance -> Chat Logs
			old_messages =  temp_org.retrieve_channel(channel_title).retrieve_instance(instance_title).get_log();
		} catch (JsonMappingException e) {
			System.out.println("System - Error Fetching Chat History");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Fetching Chat History");
		}

    	return old_messages;
    }

    // Group Member Loading
    @MessageMapping("/fetch_members/{org_id}/{channel_title}/{instance_title}")
    @SendTo("/group/members/{org_id}/{channel_title}/{instance_title}")
    public List<MembersStatus> fetch_members(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title    	
    	) {
    	// Log the Message with the URL
    	log_to_stdout("fetch_members", org_id, channel_title, instance_title);
    	
    	List<Members> temp = null;
    	List<MembersStatus> members = new ArrayList<MembersStatus>();
    	
    	try {
    		// Convert to Orgs Object
			Orgs temp_org = json_mapper.readValue(orgsjpa.getByOrgId(org_id).get_data(), Orgs.class);
			// Retrieve the Channel -> Members
			temp =  temp_org.retrieve_channel(channel_title).get_members();
			
			// Modify the Status of the Online Users
			for(int i=0; i<temp.size(); i++) {
				if(online_users.containsKey(temp.get(i).get_username())) {
					members.add(new MembersStatus(temp.get(i), online_users.get(temp.get(i).get_username())));
				} else {
					members.add(new MembersStatus(temp.get(i)));
				}
			}
		} catch (JsonMappingException e) {
			System.out.println("System - Error Fetching Members");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Fetching Members");
		}
    	
    	if(members.size() > 0) {
    		return members;
    	} else {
    		return null;
    	}
    }

/*
    // Private Chatting
    @Autowired
	private SimpMessagingTemplate simp;

    
	@MessageMapping("/send_private_message")
	public void send_private_message(@Payload ChatMessage chat_message) {
		simp.convertAndSendToUser(chat_message.get_receiver().trim(), "/reply", chat_message); 
	}

	@MessageMapping("/add_private_user")
	@SendTo(GlobalVariable.L8Z_URL+"/queue/reply")
	public ChatMessage add_private_user(@Payload ChatMessage chat_message,
			SimpMessageHeaderAccessor header_accessor) {
		// Add user in web socket session
		header_accessor.getSessionAttributes().put("private-username", chat_message.get_sender());
		return chat_message;
	}
*/
    public void log_to_stdout(String method, String org_id, String channel_title, String instance_title) {
    	System.out.println("-------------------------------------------------------------------------------------");
    	System.out.println("System - Method Called: "+method+"()");
    	System.out.println("System - Incoming Identifiers:");
    	System.out.println("System - Organisation ID: "+org_id);
    	System.out.println("System - Channel Title: "+channel_title);
    	System.out.println("System - Instance Title: "+instance_title);
    	System.out.println("-------------------------------------------------------------------------------------");
    }
}