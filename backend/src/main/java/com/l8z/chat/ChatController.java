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
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.l8z.jparepository.OrgsJpaRepository;
import com.l8z.jparepository.PrivateChatJpaRepository;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.orgs.Channels;
import com.l8z.orgs.Instances;
import com.l8z.orgs.Members;
import com.l8z.orgs.MembersStatus;
import com.l8z.orgs.Orgs;
import com.l8z.orgs.OrgsSQL;
import com.l8z.user.User;


@Controller
public class ChatController {
	@Autowired
	private OrgsJpaRepository orgsjpa;
	@Autowired
	private UserJpaRepository userjpa;
	@Autowired
	private PrivateChatJpaRepository privchatjpa;

	// Used to Read a JSON Document and Convert to Object
	private ObjectMapper json_mapper = new ObjectMapper();
	// Static Map to Keep Status of Users
	public static HashMap<String, String> online_users = new HashMap<String, String>();
	
	///////////////////////////////////////////////////////////////////////////
	///////////////////////////ORGANISATION CHATTING///////////////////////////
	///////////////////////////////////////////////////////////////////////////
    @MessageMapping("/send_message/{org_id}/{channel_title}/{instance_title}")
    @SendTo("/group/{org_id}/{channel_title}/{instance_title}")
    public ChatMessage send_message(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title,
    		@Payload ChatMessage chat_message
    	) {
    	// Log the Message with the URL
    	log_to_stdout_orgs("send_message", org_id, channel_title, instance_title);
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
    	
    	
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
    			OrgsSQL sql = new OrgsSQL(org_id, json_mapper.writeValueAsString(temp_org));
    			orgsjpa.save(sql);
    		} catch (JsonMappingException e) {
    			System.out.println("System - Error Updating Database");
    		} catch (JsonProcessingException e) {
    			System.out.println("System - Error Updating Database");
    		}
    	}
    	
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
    	log_to_stdout_orgs("existing_user", org_id, channel_title, instance_title);
    	
    	// Add user in Web Socket Session
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
    	
		// Add them to the Online List
    	if(!online_users.containsKey(chat_message.get_sender())) {
    		header_accessor.getSessionAttributes().put("username", chat_message.get_sender());
        	header_accessor.getSessionAttributes().put("url", org_id+"/"+channel_title+"/"+instance_title);
    		online_users.put(chat_message.get_sender(), "online");
    	}
    	
        return chat_message;
    }
    
    // Group History Loading
    @MessageMapping("/fetch_history/{org_id}/{channel_title}/{instance_title}/{username}")
    @SendTo("/group/history/{org_id}/{channel_title}/{instance_title}/{username}")
    public List<ChatMessage> fetch_history(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title,
    		@DestinationVariable("username") String username
    	) {
    	// Log the Message with the URL
    	log_to_stdout_orgs("fetch_history", org_id, channel_title, instance_title);
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
    @MessageMapping("/fetch_members/{org_id}/{channel_title}/{instance_title}/{username}")
    @SendTo("/group/members/{org_id}/{channel_title}/{instance_title}/{username}")
    public List<MembersStatus> fetch_members(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_title") String channel_title,
    		@DestinationVariable("instance_title") String instance_title,
    		@DestinationVariable("username") String username
    	) {
    	// Log the Message with the URL
    	log_to_stdout_orgs("fetch_members", org_id, channel_title, instance_title);
    	
    	List<Members> temp = null;
    	List<MembersStatus> members = new ArrayList<MembersStatus>();
    	
    	try {
    		// Convert to Orgs Object
			Orgs temp_org = json_mapper.readValue(orgsjpa.getByOrgId(org_id).get_data(), Orgs.class);
			// Retrieve the Channel -> Members
			temp =  temp_org.retrieve_channel(channel_title).get_members();
			
			// Modify the Status of the Online Users and Get their Details
			for(int i=0; i<temp.size(); i++) {
				Members m = temp.get(i);
				User user = userjpa.findByUsername(m.get_username());
				if(user == null) continue; // Go Next
				
				// If the User was Online, Make Sure they're displayed as Online
				if(online_users.containsKey(temp.get(i).get_username())) {
					members.add(new MembersStatus(user, online_users.get(m.get_username()), m.get_role()));
				} else {
					members.add(new MembersStatus(user, m.get_role()));
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
    
    public void log_to_stdout_orgs(String method, String org_id, String channel_title, String instance_title) {
    	System.out.println("-------------------------------------------------------------------------------------");
    	System.out.println("System - Method Called: "+method+"()");
    	System.out.println("System - Incoming Identifiers:");
    	System.out.println("System - Organisation ID: "+org_id);
    	System.out.println("System - Channel Title: "+channel_title);
    	System.out.println("System - Instance Title: "+instance_title);
    	System.out.println("-------------------------------------------------------------------------------------");
    }

    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////PRIVATE CHATTING/////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    @Autowired
	private SimpMessagingTemplate simp;

	@MessageMapping("/send_private_message/{username_one}/{username_two}")
	@SendTo("/user/reply/{username_one}/{username_two}")
	public ChatMessage send_private_message(
			@Payload ChatMessage chat_message, 
			@DestinationVariable("username_one") String username_one,
    		@DestinationVariable("username_two") String username_two
    	) {
		//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
		List<ChatMessage> all_messages = new ArrayList<ChatMessage>();
		
    	// If the Message Received WAS a CHAT Message, Save it
    	if(chat_message.get_type() == ChatMessage.MessageType.CHAT) {
        	try {
        		// Make the Unique ID
        		String unique_id = create_id(chat_message.get_receiver(), chat_message.get_sender());
        		// Get the Current Data from Database if it Exists
        		PrivateChatSQL temp = privchatjpa.getById(unique_id);
        		// If its their First Conversation, it will return null
        		if(temp != null) {
        			// Convert to List of Messages Object
            		all_messages = json_mapper.readValue(temp.get_data(), 
            				json_mapper.getTypeFactory().constructCollectionType(List.class, ChatMessage.class));
        		}  
   
        		// Add the new Message
        		all_messages.add(chat_message);
    			
    			// Save to Database
    			PrivateChatSQL sql = new PrivateChatSQL(unique_id, json_mapper.writeValueAsString(all_messages));
    			privchatjpa.save(sql);
    		} catch (JsonMappingException e) {
    			System.out.println("System - Error Updating Database");
    		} catch (JsonProcessingException e) {
    			System.out.println("System - Error Updating Database");
    		}
    	}
		//simp.convertAndSendToUser(chat_message.get_receiver(), "/reply/"+chat_message.get_receiver(), chat_message);
    	return chat_message;
	}

	@MessageMapping("/existing_private_user")
	@SendTo("/queue/reply")
	public ChatMessage existing_private_user(@Payload ChatMessage chat_message, SimpMessageHeaderAccessor header_accessor) {
		// Add them to the Online List
		if(!online_users.containsKey(chat_message.get_sender())) {
			// Add user in Web Socket Session
			header_accessor.getSessionAttributes().put("private_username", chat_message.get_sender());
    		online_users.put(chat_message.get_sender(), "online");
    	}
		
		return chat_message;
	}
	
	// Private Chat History Loading
    @MessageMapping("/fetch_private_history/{username_one}/{username_two}")
    @SendTo("/queue/{username_one}/{username_two}/reply")
    public List<ChatMessage> fetch_private_history(
    		@DestinationVariable("username_one") String username_one,
    		@DestinationVariable("username_two") String username_two
    	) {
    	log_to_stdout_private("fetch_private_history", username_one, username_two);
    	// Stores the Old Messages
    	List<ChatMessage> old_messages = null;

    	try {
    		// Make the Unique ID
    		String unique_id = create_id(username_one, username_two);
    		// Get the Record from the Table
    		PrivateChatSQL temp = privchatjpa.getById(unique_id);
    		if(temp != null) {
	    		// Convert to List of Messages Object
	    		old_messages = json_mapper.readValue(temp.get_data(), 
        				json_mapper.getTypeFactory().constructCollectionType(List.class, ChatMessage.class));
    		}
		} catch (JsonMappingException e) {
			System.out.println("System - Error Fetching Chat History");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Fetching Chat History");
		}
    	
    	return old_messages;
    }
	
    // If User One is Less Than User Two's Username, Make U1.U2 Else U2.U1
 	public String create_id(String user_one, String user_two) {
 		return user_one.compareTo(user_two) < 0 ? user_one+"."+user_two : user_two+"."+user_one;
 	}
 	
 	public void log_to_stdout_private(String method, String username_one, String username_two) {
    	System.out.println("-------------------------------------------------------------------------------------");
    	System.out.println("System - Method Called: "+method+"()");
    	System.out.println("System - Incoming Identifiers:");
    	System.out.println("System - Username One: "+username_one);
    	System.out.println("System - Username Two: "+username_two);
    	System.out.println("-------------------------------------------------------------------------------------");
    }
}