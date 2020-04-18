package com.l8z.chat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "privatechat")
public class PrivateChatSQL {
	@Id
	String id;
	@Column(length = 1999999999)
	String data;
	
	// Default Constructor
	public PrivateChatSQL() {
		
	}
	// Constructor
	public PrivateChatSQL(String id, String data) {
		this.id = id;
		this.data = data;
	}
	
	// Getters
	public String get_id() {
		return id;
	}
	public String get_data() {
		return data;
	}
	// Setters
	public void set_id(String id) {
		this.id = id;
	}
	public void set_data(String data) {
		this.data = data;
	}
	
	// If User One is Less Than User Two's Username, Make U1.U2 Else U2.U1
	public String create_id(String user_one, String user_two) {
		return user_one.compareTo(user_two) < 0 ? user_one+"."+user_two : user_two+"."+user_one;
	}
}
