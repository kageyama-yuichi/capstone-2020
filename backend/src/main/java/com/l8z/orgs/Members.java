package com.l8z.orgs;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Members {
	// Users will be found in the User Table
	@JsonProperty("username") private String username; 
	// Role will help Limit Access
	@JsonProperty("role") private Role role;

	// Enumeration Class to define Types 
    public enum Role {
    	ORG_OWNER,
        ADMIN,
        TEAM_LEADER,
        TEAM_MEMBER
    }
    
    // Default Constructor
 	public Members() {
 		
 	}
    
	// Constructor
	public Members(String username, Role role) {
		this.username = username;
		this.role = role;
	}
	
	// Getters
	public String get_username() {
		return username;
	}
	public Role get_role() {
		return role;
	}
	
	// Setters
	public void set_username(String username) {
		this.username = username;
	}
	public void set_org_role(Role role) {
		this.role = role;
	}
	
	// Comparison 
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Members comp = (Members) o;
        return username.equals(comp.username);
    }
	
}
