package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import com.l8z.orgs.repository.OrgsJpaRepository;

@Controller
public class ChatController {
	@Autowired
	private OrgsJpaRepository orgsjpa;
	
	// Group Chatting
    @MessageMapping("/send_message/{org_id}/{channel_id}/{instance_id}")
    @SendTo("/group/{org_id}/{channel_id}/{instance_id}")
    public ChatMessage send_message(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_id") String channel_id,
    		@DestinationVariable("instance_id") String instance_id,
    		@Payload ChatMessage chat_message) {
    	log_to_stdout("send_message", org_id, channel_id, instance_id);

    	//orgsjpa.save(chat_message);
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
        return chat_message;
    }

    @MessageMapping("/existing_user/{org_id}/{channel_id}/{instance_id}")
    @SendTo("/group/{org_id}/{channel_id}/{instance_id}")
    public ChatMessage existing_user(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_id") String channel_id,
    		@DestinationVariable("instance_id") String instance_id,    		
    		@Payload ChatMessage chat_message, 
    		SimpMessageHeaderAccessor header_accessor) {
    	log_to_stdout("existing_user", org_id, channel_id, instance_id);

    	// Add user in Web Socket Session
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
    	header_accessor.getSessionAttributes().put("username", chat_message.get_sender());
        return chat_message;
    }
    
    // Group History Loading
    @MessageMapping("/fetch_history/{org_id}/{channel_id}/{instance_id}")
    @SendTo("/group/history/{org_id}/{channel_id}/{instance_id}")
    public List<ChatMessage> fetch_history(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_id") String channel_id,
    		@DestinationVariable("instance_id") String instance_id
    	) {
    	log_to_stdout("fetch_history", org_id, channel_id, instance_id);

    	List<ChatMessage> old_messages = new ArrayList<ChatMessage>();
    	ChatMessage temp = new ChatMessage();
    	temp.set_sender("Tyler");
    	temp.set_type(ChatMessage.MessageType.CHAT);
    	temp.set_content("Hey Bois, make sure to do your work tonight mmk?");
    	old_messages.add(temp);
    	temp = new ChatMessage();
    	temp.set_sender("Michael");
    	temp.set_type(ChatMessage.MessageType.CHAT);
    	temp.set_content("Hey Joe, sorry I'm quite busy with React");
    	old_messages.add(temp);

    	return old_messages;
    }

    // Group Member Loading
    @MessageMapping("/fetch_members/{org_id}/{channel_id}/{instance_id}")
    @SendTo("/group/members/{org_id}/{channel_id}/{instance_id}")
    public List<ChatMessage> fetch_members(
    		@DestinationVariable("org_id") String org_id,
    		@DestinationVariable("channel_id") String channel_id,
    		@DestinationVariable("instance_id") String instance_id    	
    		) {
    	log_to_stdout("fetch_members", org_id, channel_id, instance_id);
    	
    	List<ChatMessage> members = new ArrayList<ChatMessage>();
    	ChatMessage temp = new ChatMessage();
    	temp = new ChatMessage();
    	temp.set_sender("Michael");
    	members.add(temp);
    	temp = new ChatMessage();
    	temp.set_sender("Tyler");
    	members.add(temp);
    	temp = new ChatMessage();
    	temp.set_sender("Yuichi");
    	members.add(temp);
    	temp = new ChatMessage();
    	temp.set_sender("Matthew");
    	members.add(temp);
    	temp = new ChatMessage();
    	temp.set_sender("Raimond");
    	members.add(temp);
    	temp = new ChatMessage();
    	temp.set_sender("Hung");
    	members.add(temp);

    	return members;
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
    public void log_to_stdout(String method, String one, String two, String three) {
    	System.out.println("-------------------------------------------------------------------------------------");
    	System.out.println("System - Method Called: "+method+"()");
    	System.out.println("System - Incoming Identifiers:");
    	System.out.println("System - Organisation ID: "+one);
    	System.out.println("System - Channel ID: "+two);
    	System.out.println("System - Instance ID: "+three);
    	System.out.println("-------------------------------------------------------------------------------------");
    }
}