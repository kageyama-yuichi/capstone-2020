package com.l8z.web_socket;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import org.slf4j.Logger; // Used to Log WebSocketEvents
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.l8z.chat.ChatController;
import com.l8z.chat.ChatMessage; // Importing our ChatMessage class

@Component
public class WebSocketEventListener {
	// Creating a Logger for the Class
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messaging_template;

    // Log when someone joins the Application
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("System - Received a New Web Socket Connection");
    }

    // Log when someone disconnects from the Application
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor header_accessor = StompHeaderAccessor.wrap(event.getMessage());
        // For Organisation User
        String username = (String) header_accessor.getSessionAttributes().get("username");
        //String extension = (String) header_accessor.getSessionAttributes().get("url");
        // For Private Chatting User
        String private_username = (String) header_accessor.getSessionAttributes().get("private_username");
        String user_disconnected = null;
        boolean should_send_message = false;
        
        // Group Users
        if(username != null) {            
            // Make Sure They Are Offline
            ChatController.online_users.remove(username);
            user_disconnected = username;
            should_send_message = true;
        }
        
        // Private User
        if(private_username != null) {  
            // Make Sure They Are Offline
            ChatController.online_users.remove(username);
            user_disconnected = private_username;
            should_send_message = true;
        }
        
        // Ensure the Message is Sent
        if(should_send_message) {
	        // Create the ChatMessage Object
	        ChatMessage chat_dc = new ChatMessage();
	        chat_dc.set_type(ChatMessage.MessageType.LEAVE);
	        chat_dc.set_sender(user_disconnected);
	        // Send the Message
	        messaging_template.convertAndSend("/online", chat_dc);
        }
    }
}