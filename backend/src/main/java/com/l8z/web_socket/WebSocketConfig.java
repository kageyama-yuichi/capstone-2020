package com.l8z.web_socket;
// Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

import com.l8z.GlobalVariable;

@Configuration
@EnableWebSocketMessageBroker // Enables our WebSocket server
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override // Clients will use to Connect
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // SockJS is used to enable fallback options for browsers that don’t support WebSocket
    	registry.addEndpoint("/chat").setAllowedOrigins(GlobalVariable.L8Z_URL).withSockJS();
        
    }

    @Override // Route Messages from one Client to Another
    public void configureMessageBroker(MessageBrokerRegistry registry) {
    	// A message with destination /app/chat.send_message will be routed to
    	// the send_message() method, and a message with destination 
    	// /app/chat.existing_user will be routed to the exisiting_user() method
    	registry.setApplicationDestinationPrefixes("/app");
        // This will be used for Group Channel Chat Instances
        // i.e., This will be "/group-id/channel/"
        registry.enableSimpleBroker("/group/public","/queue"); 
    }
}