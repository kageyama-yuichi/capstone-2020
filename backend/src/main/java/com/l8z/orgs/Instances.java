package com.l8z.orgs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;

import com.l8z.chat.ChatMessage;
import com.l8z.orgs.converter.JSONObjectConverter;

@Entity
public class Instances {
	@Id
	// A String used for Displaying the Instance 
	private String instanceTitle;
	@Enumerated(EnumType.STRING)
	private InstanceType type;
	@Column(length=1999999999)
	@Convert(converter = JSONObjectConverter.class)
	private List<ChatMessage> log = new ArrayList<>();
	// private Something voice
	
	// Enumeration Class to define Types 
    public enum InstanceType {
    	CHAT,
        VOICE
    }
    
	// Constructor
    public Instances(String instance_title, InstanceType type) {
    	this.instanceTitle = instance_title;
    	this.type = type;
    }
    
    // Getters
    public String get_instance_title() {
    	return instanceTitle;
    }
    public InstanceType get_type() {
    	return type;
    }
    public List<ChatMessage> get_all_log() {
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
    	this.instanceTitle = instance_title;
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
         return instanceTitle == comp.instanceTitle;
     }
}
