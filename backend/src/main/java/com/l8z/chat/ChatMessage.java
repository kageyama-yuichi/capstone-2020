package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

// Message Payload that will be Sent to the Server
public class ChatMessage {
	// Members
    private MessageType type;
    private String content;
    private String sender;

    // Enumeration Class to define Types
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
    
    // Getters 
    public MessageType get_type() {
        return type;
    }
    public String get_content() {
        return content;
    }
    public String get_sender() {
        return sender;
    }

    // Setters
    public void set_type(MessageType type) {
        this.type = type;
    }
    public void set_content(String content) {
        this.content = content;
    }
    public void set_sender(String sender) {
        this.sender = sender;
    }
}
