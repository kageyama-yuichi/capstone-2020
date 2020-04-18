package com.l8z.orgs;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import com.l8z.chat.ChatMessage;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
// A Class to Hold all Organisation Related Information
public class Orgs {
	// Unique to the Organisation
	@JsonProperty("org_id") private String org_id;
	// Multiple Organisations can have the same Title
	@JsonProperty("org_title") private String org_title; 
	// Stores all the Members of the Organisation
	@JsonProperty("members") private List<Members> members = new ArrayList<>();
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
	public List<Members> get_members(){
		return members;
	}
	public boolean has_member(Members member) {
		return members.contains(member);
	}
	public Members retrieve_member(String username) {
		Members member = null;
		for(int i=0; i<members.size(); i++) {
			if(members.get(i).equals(new Members(username, Members.Role.ORG_OWNER))) {
				member = members.get(i);
				break;
			}
		}
		return member;
	}
	public List<Channels> get_channels() {
		return channels;
	}
	public Channels retrieve_channel(String channel_title) {
		Channels temp = null;
		for(int i=0; i<channels.size(); i++) {
			if(channels.get(i).get_channel_title().equals(channel_title)) {
				temp = channels.get(i);
				break;
			}
		}
		return temp;
	}
	
	// Setters
	public void set_org_id(String org_id) {
		this.org_id = org_id;
	}
	public void set_org_title(String org_title) {
		this.org_title = org_title;
	}
	
	// Additional Functionality
	public void add_member(Members new_member) {
		members.add(new_member);
	}
	public void add_channel(Channels new_channel) {
		channels.add(new_channel);
	}
	public void add_instance(String channel_title, Instances new_instance) {
		// Hold the Old Values
		Channels temp = retrieve_channel(channel_title);
		// Remove the Old Channel
		channels.remove(temp);
		// Update Channel and Save
		temp.add_instance(new_instance);
		channels.add(temp);
	}
	public void remove_instance(String channel_title, String instance_title) {
		// Hold the Old Values
		Channels temp = retrieve_channel(channel_title);
		// Remove the Old Channel
		channels.remove(temp);
		// Update Channel and Save
		temp.remove_instance(new Instances(instance_title, Instances.InstanceType.CHAT));
		channels.add(temp);
	}
	public void remove_channel(Channels old_channel) {
		channels.remove(old_channel);
	}
	public void clear_channel() {
		channels.clear();
	}
	
	
	public boolean manage_member(Members auth, Members member, Members.Role new_role) {
		boolean change_status = false;
		// ORG_OWNER cannot have their Role adjusted and ORG_OWNER cannot be Given Here
		if(member.get_role() != Members.Role.ORG_OWNER && new_role != Members.Role.ORG_OWNER) {
			// Check the "auth" Member for User Heirarchy: ORG_OWNER > ADMIN > TEAM_LEADER > TEAM_MEMBER
			if(auth.get_role() == Members.Role.ORG_OWNER || auth.get_role() == Members.Role.ADMIN) {
				// Removes the Old Member
				members.remove(member);
				// Adds the Member with Updated Role
				members.add(new Members(member.get_username(), new_role));
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
	
	// Display
	public void display_org_structure() {
		System.out.println("org_id: "+org_id);
        System.out.println("org_title: "+org_title);
        System.out.println("members: {");
        for(int i=0; i<members.size(); i++) {
        	Members temp = members.get(i);
        	System.out.println("   username: "+temp.get_username() +", role: "+temp.get_role());
        }
        System.out.println("}");
        System.out.println("channels: {");
        for(int i=0; i<channels.size(); i++) {
        	Channels temp = channels.get(i);
        	System.out.println("    channel_title: "+temp.get_channel_title());
        	System.out.println("    owner: "+temp.get_owner().get_username() +", role: "+temp.get_owner().get_role());
        	System.out.println("    members: {");
        	for(int j=0; j<temp.get_members().size(); j++) {
            	Members inner_temp = temp.get_members().get(j);
            	System.out.println("        username: "+inner_temp.get_username() +", role: "+inner_temp.get_role());
        	}
        	System.out.println("    }");
        	System.out.println("    instances: {");
        	for(int j=0; j<temp.get_instances().size(); j++) {
        		Instances inner_temp = temp.get_instances().get(j);
        		System.out.println("        instance_title: "+inner_temp.get_instance_title());
        		System.out.println("        instance_type: "+inner_temp.get_type());
        		System.out.println("        log: {");
        		for(int k=0; k<inner_temp.get_log().size(); k++) {
        			ChatMessage inner_inner_temp = inner_temp.get_log().get(k);
        			System.out.println("            sender: "+inner_inner_temp.get_sender());
        			System.out.println("            receiver: "+inner_inner_temp.get_receiver());
        			System.out.println("            content: "+inner_inner_temp.get_content());
        			System.out.println("            date_time: "+inner_inner_temp.get_date_time());
        		}
        		System.out.println("        }");
        	}
        }
        System.out.println("}");
	}
	
}
