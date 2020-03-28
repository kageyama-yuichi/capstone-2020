package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import java.time.LocalDateTime;

// Message Payload that will be Sent to the Server
public class ChatMessage {
	// Members
    private MessageType type;
    private String content;
    private String sender;
    private String receiver;
	private LocalDateTime date_time=LocalDateTime.now();; 

    // Enumeration Class to define Types
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        IS_TYPING
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
    public String get_receiver() {
        return receiver;
    }
    public LocalDateTime get_date_time() {
		return date_time;
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
    public void set_receiver(String receiver) {
		this.receiver = receiver;
	}
    public void set_date_time(LocalDateTime date_time) {
		this.date_time = date_time;
	}
}
