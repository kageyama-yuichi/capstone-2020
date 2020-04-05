package com.l8z.orgs;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Member {
	@Id
	@GeneratedValue
	private Long id;
	// Users will be found in the User Table
	private String username; 
	// Role will help Limit Access
	@Enumerated(EnumType.STRING)
	private Role role;

	// Enumeration Class to define Types 
    public enum Role {
    	ORG_OWNER,
        ADMIN,
        TEAM_LEADER,
        TEAM_MEMBER
    }
    
	// Constructor
	public Member(Long id, String username, Role role) {
		this.id = id;
		this.username = username;
		this.role = role;
	}
	
	// Getters
	public Long get_id() {
		return id;
	}
	public String get_username() {
		return username;
	}
	public Role get_role() {
		return role;
	}
	
	// Setters
	public void set_id(Long id) {
		this.id = id;
	}
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
        
        Member comp = (Member) o;
        return username == comp.username;
    }
	
}
