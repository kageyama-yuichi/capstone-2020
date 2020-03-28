package com.l8z.web_socket;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import com.l8z.chat.ChatMessage.MessageType;
import com.l8z.chat.ChatMessage; // Importing our ChatMessage class
import org.slf4j.Logger; // Used to Log WebSocketEvents
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
	// Creating a Logger for the Class
    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    // Log when someone joins the Application
    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.info("Received a New Web Socket Connection");
    }


    // Log when someone disconnects from the Application
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor header_accessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) header_accessor.getSessionAttributes().get("username");
        if(username != null) {
            logger.info("User Disconnected : " + username);

            ChatMessage chat_dc = new ChatMessage();
            chat_dc.set_type(ChatMessage.MessageType.LEAVE);
            chat_dc.set_sender(username);

            messagingTemplate.convertAndSend("/topic/public", chat_dc);
        }
    }
}