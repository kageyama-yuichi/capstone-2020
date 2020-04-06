package com.l8z.orgs;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.l8z.orgs.converter.JSONObjectConverter;

@Entity
public class Channels {
	@Id
	// A String used for Displaying the Channel (Unique)
	private String channelTitle;
	// Owner of Channel is only allowed to Delete their Channel
	@Column(length=65535)
	@Convert(converter = JSONObjectConverter.class)
	private Member owner;
	// Keeps a List of Members who have access to this Channel
	@Column(length=65535)
	@Convert(converter = JSONObjectConverter.class)
	private List<Member> members = new ArrayList<>();
	// Keeps a List of all the Instances that are Created for this Channel
	@Column(length=65535)
	@Convert(converter = JSONObjectConverter.class)
	private List<Instances> instances = new ArrayList<>();
	
	// Constructor
	public Channels(String channel_title, Member owner) {
		this.channelTitle = channel_title;
		this.owner = owner;
	}
	
	// Getters
	public String get_channel_title() {
		return channelTitle;
	}
	public Member get_owner() {
		return owner;
	}
	public List<Member> get_channel_members() {
		return members;
	}
	public boolean has_member(Member member) {
		return members.contains(member);
	}
	public List<Instances> get_instances() {
		return instances;
	}
	
	// Setters
	public void set_channel_title(String channel_title) {
		this.channelTitle = channel_title;
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
		members.add(new Member(member.get_id(), member.get_username(), new_role));
		
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
         return channelTitle == comp.channelTitle;
     }
}
