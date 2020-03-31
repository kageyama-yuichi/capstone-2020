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
    @SendTo("/group/public")
    public ChatMessage send_message(@Payload ChatMessage chat_message) {
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
        return chat_message;
    }

    @MessageMapping("/existing_user")
    @SendTo("/group/public")
    public ChatMessage existing_user(@Payload ChatMessage chat_message, 
                               SimpMessageHeaderAccessor header_accessor) {
        // Add user in Web Socket Session
    	//chat_message.display_message(); // Displays the Chat Message for Debugging Purposes
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
	@SendTo(GlobalVariable.L8Z_URL+"/queue/reply")
	public ChatMessage add_private_user(@Payload ChatMessage chat_message,
			SimpMessageHeaderAccessor header_accessor) {
		// Add user in web socket session
		header_accessor.getSessionAttributes().put("private-username", chat_message.get_sender());
		return chat_message;
	}
	*/
}