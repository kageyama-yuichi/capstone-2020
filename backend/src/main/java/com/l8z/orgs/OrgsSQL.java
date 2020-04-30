package com.l8z.orgs;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "orgs")
public class OrgsSQL {
	@Id
	String orgId;
	@Column(length = 1999999999)
	String data;
	String recent_date_time = "";
	
	// Default Constructor
	public OrgsSQL() {
		
	}
	// Override Constructor
	public OrgsSQL(String orgId, String data, String recent_date_time) {
		this.orgId = orgId;
		this.data = data;
		this.recent_date_time = recent_date_time;
	}
	// Override Constructor
	public OrgsSQL(String orgId, String data, boolean new_date) {
		this.orgId = orgId;
		this.data = data;
		if(new_date) {
			this.recent_date_time = (new SimpleDateFormat("h:mm a (dd/MM/yyyy)").format(new Date())).toUpperCase();
		}
	}
	// Override Constructor
	public OrgsSQL(String orgId, String data) {
		this.orgId = orgId;
		this.data = data;
	}
	
	// Getters
	public String get_id() {
		return orgId;
	}
	public String get_data() {
		return data;
	}
	public String get_recent_date_time() {
		return recent_date_time;
	}
	
	// Setters
	public void set_id(String orgId) {
		this.orgId = orgId;
	}
	public void set_data(String data) {
		this.data = data;
	}
	public void set_recent_date_time(String recent_date_time) {
		this.recent_date_time = recent_date_time;
	}
}
