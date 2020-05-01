package com.l8z.pending;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "PendingInvites")
public class PendingInvites {
	// Members of Table
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	// A Field to Locate the Correct Record by orgId+"."invitee
	private String uniqueId;
	// A Field to Locate the Correct Record for Channel Invites
	private String channelUniqueId;
	// Person's Username who is Inviting the Invitee
	private String inviter;
	// Person who is being Invited to the Organisation
	private String invitee;
	// The Organisation ID that the Invitee was Invited to
	private String orgId;
	
	// Default Constructor
	public PendingInvites() {
		
	}
	// Override Constructor
	public PendingInvites(String uniqueId, String channelUniqueId, String inviter, String invitee, String orgId) {
		this.uniqueId = uniqueId;
		this.channelUniqueId = channelUniqueId;
		this.inviter = inviter;
		this.invitee = invitee;
		this.orgId = orgId;
	}

	// Getters
	public Long getId() {
		return id;
	}
	public String getUniqueId() {
		return uniqueId;
	}
	public String getChannelUniqueId() {
		return channelUniqueId;
	}
	public String getInviter() {
		return inviter;
	}
	public String getInvitee() {
		return invitee;
	}
	public String getOrgId() {
		return orgId;
	}
	
	// Setters
	public void setId(Long id) {
		this.id = id;
	}
	public void setUniqueId(String uniqueId) {
		this.uniqueId = uniqueId;
	}
	public void setChannelUniqueId(String channelUniqueId) {
		this.channelUniqueId = channelUniqueId;
	}
	public void setInviter(String inviter) {
		this.inviter = inviter;
	}
	public void setInvitee(String invitee) {
		this.invitee = invitee;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
}
