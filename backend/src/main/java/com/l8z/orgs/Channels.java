package com.l8z.orgs;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Channels {
	// A String used for Displaying the Channel (Unique)
	@JsonProperty("channel_title") private String channel_title;
	// Owner of Channel is only allowed to Delete their Channel
	@JsonProperty("owner") private Member owner;
	// Keeps a List of Members who have access to this Channel
	@JsonProperty("members") private List<Member> members = new ArrayList<>();
	// Keeps a List of all the Instances that are Created for this Channel
	@JsonProperty("instances") private List<Instances> instances = new ArrayList<>();
	
	// Default Constructor
	public Channels() {
		
	}
	
	// Constructor
	public Channels(String channel_title, Member owner) {
		this.channel_title = channel_title;
		this.owner = owner;
	}
	
	// Getters
	public String get_channel_title() {
		return channel_title;
	}
	public Member get_owner() {
		return owner;
	}
	public List<Member> get_members() {
		return members;
	}
	public boolean has_member(Member member) {
		return members.contains(member);
	}
	public List<Instances> get_instances() {
		return instances;
	}
	public Instances retrieve_instance(String instance_title) {
		Instances temp = null;
		for(int i=0; i<instances.size(); i++) {
			if(instances.get(i).get_instance_title().equals(instance_title)) {
				temp = instances.get(i);
				break;
			}
		}
		return temp;
	}
	// Setters
	public void set_channel_title(String channel_title) {
		this.channel_title = channel_title;
	}
	public void set_owner(Member owner) {
		this.owner = owner;
	}
	public void add_member(Member new_member) {
		members.add(new_member);
	} 
	public void remove_member(Member old_member) {
		members.remove(old_member);
	} 
	public void manage_member(Member member, Member.Role new_role) {
		// Removes the Old Member
		members.remove(member);
		// Adds the Member with Updated Role
		members.add(new Member(member.get_username(), new_role));
		
	}
	public void add_instance(Instances new_instance) {
		instances.add(new_instance);
	}
	public void remove_instance(Instances old_instance) {
		instances.remove(old_instance);
	}
	
	// Comparison 
 	@Override
     public boolean equals(Object o) {
         if (this == o) return true;
         if (o == null || getClass() != o.getClass()) return false;
         
         Channels comp = (Channels) o;
         return channel_title == comp.channel_title;
     }
}
