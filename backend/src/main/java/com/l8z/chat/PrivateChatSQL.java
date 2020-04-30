package com.l8z.chat;

import java.text.SimpleDateFormat;
import java.util.Date;

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
	String recent_date_time = "";
	
	// Default Constructor
	public PrivateChatSQL() {
		
	}
	// Override Constructor
	public PrivateChatSQL(String id, String data, String recent_date_time) {
		this.id = id;
		this.data = data;
		this.recent_date_time = recent_date_time;
	}
	// Override Constructor
	public PrivateChatSQL(String id, String data, boolean new_date) {
		this.id = id;
		this.data = data;
		this.recent_date_time = (new SimpleDateFormat("h:mm a (dd/MM/yyyy)").format(new Date())).toUpperCase();
	}
	
	// Getters
	public String get_id() {
		return id;
	}
	public String get_data() {
		return data;
	}
	public String get_recent_date_time() {
		return recent_date_time;
	}
	
	// Setters
	public void set_id(String id) {
		this.id = id;
	}
	public void set_data(String data) {
		this.data = data;
	}
	public void set_recent_date_time(String recent_date_time) {
		this.recent_date_time = recent_date_time;
	}
}
