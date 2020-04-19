package com.l8z.orgs;

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
	
	// Default Constructor
	public OrgsSQL() {
		
	}
	// Constructor
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
	// Setters
	public void set_id(String orgId) {
		this.orgId = orgId;
	}
	public void set_data(String data) {
		this.data = data;
	}	
}
