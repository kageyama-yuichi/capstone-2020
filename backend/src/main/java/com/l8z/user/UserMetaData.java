package com.l8z.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@Entity
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class UserMetaData {
	// Members of Table
	@Id
	@JsonProperty("username") String username;
	@Column(length = 5000) // Stores the org_id of the Orgs they are in
	@JsonProperty("org_ids") String org_ids;
	@Column(length = 200000) // Stores the org_id.channel_title that they are in
	@JsonProperty("org_channels") String org_channels;
	@Column(length = 200000) // Store the contact list of the User
	@JsonProperty("contact_list") String contact_list;
	@Column(length = 200000) // Store the favourite channel of the User
	@JsonProperty("fav_channel") String fav_channel;
	
	// Default Constructor
	public UserMetaData() {
		
	}
	// Override Constructor
	public UserMetaData(String username, String org_ids, String org_channels, String contact_list, String fav_channel) {
		this.username = username;
		this.org_ids = org_ids;
		this.org_channels = org_channels;
		this.contact_list = contact_list;
		this.fav_channel = fav_channel;
	}
	
	// Getters
	public String get_username() {
		return username;
	}
	public String get_org_ids() {
		return org_ids;
	}
	public String get_org_channels() {
		return org_channels;
	}
	public String get_contact_list() {
		return contact_list;
	}
	public String get_fav_channel() {
		return fav_channel;
	}

	// Setters
	public void set_username(String username) {
		this.username = username;
	}
	public void set_org_ids(String org_ids) {
		this.org_ids = org_ids;
	}
	public void set_org_channels(String org_channels) {
		this.org_channels = org_channels;
	}
	public void set_contact_list(String contact_list) {
		this.contact_list = contact_list;
	}
	public void set_fav_channel(String fav_channel) {
		this.fav_channel = fav_channel;
	}
	
	// Comparison 
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        UserMetaData comp = (UserMetaData) o;
        return username.equals(comp.username);
    }
}
