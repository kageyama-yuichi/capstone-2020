package com.l8z.orgs;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.l8z.orgs.Members.Role;
import com.l8z.user.BasicUser;
import com.l8z.user.User;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class MembersStatus extends BasicUser {
	// Status for Users
	@JsonProperty("status") private String status = "offline";
	// Role will help Limit Access
	@JsonProperty("role") private Role role;
	
    // Default Constructor
 	public MembersStatus() {
 		
 	}
    
	// Constructor
 	// Utilises BasicUser's Constructor and the Status and Role of Member
	public MembersStatus(User user, String status, Role role) {
		super(user);
    	this.status = status;
    	this.role = role;
	}
	public MembersStatus(User user, Role role) {
		super(user);
    	this.role = role;
	}
	
	// Getters
	public String get_status() {
		return status;
	}
	public Role get_role() {
		return role;
	}
	
	// Setters
	public void set_status(String status) {
		this.status = status;
	}
	public void set_role(Role role) {
		this.role = role;
	}
}
