package com.l8z.orgs;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class MembersStatus extends Members {
	// Status for Users
	@JsonProperty("status") private String status = "offline";

    // Default Constructor
 	public MembersStatus() {
 		
 	}
    
	// Constructor
	public MembersStatus(String username, Role role, String status) {
		super(username, role);
    	this.status = status;
	}	
	
	// Override Constructor
	public MembersStatus(Members member, String status) {
		super(member.get_username(), member.get_role());
    	this.status = status;
	}	
	
	// Override Constructor
	public MembersStatus(Members member) {
		super(member.get_username(), member.get_role());
	}	
	
	// Getters
	public String get_status() {
		return status;
	}
	
	// Setters
	public void set_status(String status) {
		this.status = status;
	}
}
