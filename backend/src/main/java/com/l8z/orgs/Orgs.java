package com.l8z.orgs;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
// A Class to Hold all Organisation Related Information
public class Orgs {
	// Unique to the Organisation
	@JsonProperty("org_id") private String org_id;
	// Multiple Organisations can have the same Title
	@JsonProperty("org_title") private String org_title; 
	// Stores all the Members of the Organisation
	@JsonProperty("members") private List<Member> members = new ArrayList<>();
	// Stores all the Channels
	@JsonProperty("channels")private List<Channels> channels = new ArrayList<>();
	
	// Default Constructor
	public Orgs() {
		
	}
	
	// Constructor
	public Orgs(String org_id, String org_title) {
		this.org_id = org_id;
		this.org_title = org_title;
	}
	
	// Getters
	public String get_org_id() {
		return org_id;
	}
	public String get_org_title() {
		return org_title;
	}
	public List<Member> get_members(){
		return members;
	}
	public boolean has_member(Member member) {
		return members.contains(member);
	}
	public List<Channels> get_channels() {
		return channels;
	}
	
	// Setters
	public void set_org_id(String org_id) {
		this.org_id = org_id;
	}
	public void set_org_title(String org_title) {
		this.org_title = org_title;
	}
	public void add_member(Member new_member) {
		members.add(new_member);
	}
	public boolean manage_member(Member auth, Member member, Member.Role new_role) {
		boolean change_status = false;
		// ORG_OWNER cannot have their Role adjusted and ORG_OWNER cannot be Given Here
		if(member.get_role() != Member.Role.ORG_OWNER && new_role != Member.Role.ORG_OWNER) {
			// Check the "auth" Member for User Heirarchy: ORG_OWNER > ADMIN > TEAM_LEADER > TEAM_MEMBER
			if(auth.get_role() == Member.Role.ORG_OWNER || auth.get_role() == Member.Role.ADMIN) {
				// Removes the Old Member
				members.remove(member);
				// Adds the Member with Updated Role
				members.add(new Member(member.get_username(), new_role));
				// Go through All Channels and Update that Member
				for(int i=0; i<channels.size(); i++) {
					// Checking if the Member Exists in that Channel
					if(channels.get(i).has_member(member)) {
						// Store the Inner Channel Temporarily
						Channels inner_channel = channels.get(i);
						// Remove the Old Channel Details
						channels.remove(inner_channel);
						// Update this Channel for the Updated Member
						inner_channel.manage_member(member, new_role);
						// Insert the Channel Back
						channels.add(inner_channel);
					}
				}
				change_status = true;
			}
			
		}
		
		return change_status;
	}
	public void add_channel(Channels new_channel) {
		channels.add(new_channel);
	}

	// Display
	public void display_org_structure() {
		System.out.println("org_id: "+org_id);
        System.out.println("org_title: "+org_title);
        System.out.println("members: {");
        for(int i=0; i<members.size(); i++) {
        	System.out.println("username: "+members.get(i).get_username() +", role: "+members.get(i).get_role());
        }
	}
	
}
