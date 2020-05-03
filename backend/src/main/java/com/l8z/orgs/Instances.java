package com.l8z.orgs;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.l8z.chat.ChatMessage;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Instances {
	// A String used for Displaying the Instance 
	@JsonProperty("instance_title") private String instance_title;
	// A InstanceType used for allocating a type of instance (VOICE/TEXT)
	@JsonProperty("type") private InstanceType type;
	// A List used for storing messages in an instance
	@JsonProperty("log") private List<ChatMessage> log = new ArrayList<>();
	// private Something voice
	
	// Enumeration Class to define Types 
    public enum InstanceType {
    	CHAT,
        VOICE
    }
    
    // Default Constructor
 	public Instances() {
 		
 	}
    
	// Constructor
    public Instances(String instance_title, InstanceType type) {
    	this.instance_title = instance_title;
    	this.type = type;
    }
    
    // Getters
    public String get_instance_title() {
    	return instance_title;
    }
    public InstanceType get_type() {
    	return type;
    }
    public List<ChatMessage> get_log() {
    	return log;
    }
    // Returns the Most Recent n Logs
    public List<ChatMessage> get_recent_log(int n) {
    	List<ChatMessage> temp_log = new ArrayList<>();
    	// Check if we can Return The Recent n Logs
    	if(n <= log.size()) {
	    	for(int i=log.size()-n; i<log.size(); i++) {
	    		temp_log.add(log.get(i));
	    	}
    	} else {
    		temp_log = log;
    	}
    	return temp_log;
    }
    
    // Setters
    public void set_instance_title(String instance_title) {
    	this.instance_title = instance_title;
    } 
    public void set_type(InstanceType type) {
    	this.type = type;
    }

    public void add_message(ChatMessage msg) {
    	log.add(msg);
    }
    /*
    // Potentially a Remove Message Function
    public void remove_message(ChatMessage msg) {
    	log.remove(msg);
    } 
    */
    
    // Comparison 
 	@Override
     public boolean equals(Object o) {
         if (this == o) return true;
         if (o == null || getClass() != o.getClass()) return false;
         
         Instances comp = (Instances) o;
         return instance_title.equals(comp.instance_title);
     }
}
