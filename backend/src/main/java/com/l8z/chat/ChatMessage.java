package com.l8z.chat;
//Sourced from: https://www.callicoder.com/spring-boot-websocket-chat-example/

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
// Message Payload that will be Sent to the Server
public class ChatMessage {
	// Members
	@JsonProperty("type") private MessageType type;
	@JsonProperty("content") private String content;
	@JsonProperty("sender") private String sender;
	@JsonProperty("receiver") private String receiver;
    @JsonProperty("date_time") private String date_time = (new SimpleDateFormat("hh:mm (dd/MM/yyyy)", Locale.getDefault())).format(new Date());; 

    // Enumeration Class to define Types
    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE,
        TYPING
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
    public String get_date_time() {
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
    
    public void display_message() {
    	System.out.println("Type: "+this.type);
    	System.out.println("Content: "+this.content);
    	System.out.println("Sender: "+this.sender);
    	System.out.println("Receiver: "+this.receiver);
    	System.out.println("Date Time: "+this.date_time);
    }
}
