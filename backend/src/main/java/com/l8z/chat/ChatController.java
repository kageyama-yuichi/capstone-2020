package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
	// Group Chatting
    @MessageMapping("/send_message/{group_id}")
    @SendTo("/group/{group_id}")
    public ChatMessage send_message(@DestinationVariable("group_id") String group_id, @Payload ChatMessage chat_message) {
    	System.out.println(group_id);
    	chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
        return chat_message;
    }

    @MessageMapping("/existing_user/{group_id}")
    @SendTo("/group/{group_id}")
    public ChatMessage existing_user(@DestinationVariable("group_id") String group_id, @Payload ChatMessage chat_message, 
    		SimpMessageHeaderAccessor header_accessor) {
    	System.out.println(group_id);
        // Add user in Web Socket Session
    	chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
    	header_accessor.getSessionAttributes().put("username", chat_message.get_sender());
        return chat_message;
    }
    
    // Group History Loading
    @MessageMapping("/fetch_history/{group_id}")
    @SendTo("/group/history/{group_id}")
    public List<ChatMessage> fetch_history(@DestinationVariable("group_id") String group_id) {
    	System.out.println(group_id);
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
    @MessageMapping("/fetch_members/{group_id}")
    @SendTo("/group/members/{group_id}")
    public List<ChatMessage> fetch_members(@DestinationVariable("group_id") String group_id) {
    	System.out.println(group_id);
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
}