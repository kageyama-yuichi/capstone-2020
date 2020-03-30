package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import com.l8z.chat.ChatMessage; // Importing our ChatMessage class

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {
	// Group Chatting
    @MessageMapping("/send_message")
    @SendTo("http://localhost:6492/group/public")
    public ChatMessage sendMessage(@Payload ChatMessage chat_message) {
        return chat_message;
    }

    @MessageMapping("/exisiting_user")
    @SendTo("http://localhost:6492/group/public")
    public ChatMessage addUser(@Payload ChatMessage chat_message, 
                               SimpMessageHeaderAccessor header_accessor) {
        // Add user in Web Socket Session
    	header_accessor.getSessionAttributes().put("username", chat_message.get_sender());
        return chat_message;
    }
    
    /*
    // Private Chatting
    @Autowired
	private SimpMessagingTemplate simp_messaging_template;

	@MessageMapping("/send_private_message")
	public void send_private_message(@Payload ChatMessage chat_message) {
		simp_messaging_template.convertAndSendToUser(
				chat_message.get_receiver().trim(), "/reply", chat_message); 
	}

	@MessageMapping("/add_private_user")
	@SendTo("http://localhost:6492/queue/reply")
	public ChatMessage add_private_user(@Payload ChatMessage chat_message,
			SimpMessageHeaderAccessor header_accessor) {
		// Add user in web socket session
		header_accessor.getSessionAttributes().put("private-username", chat_message.get_sender());
		return chat_message;
	}
	*/
}