package com.l8z.contacts;

import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Contact {
	//Username of recipient
	@Id
	@JsonProperty("target")private String target;
	//True if accepted
	@JsonProperty("status")private boolean status;
	
	public Contact(String target) {
		this.target = target;
		status = false;
	}

	public String getTarget() {
		return target;
	}

	public void setTarget(String target) {
		this.target = target;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}
}
