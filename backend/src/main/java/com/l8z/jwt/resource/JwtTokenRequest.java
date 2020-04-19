package com.l8z.jwt.resource;

import java.io.Serializable;

public class  JwtTokenRequest implements Serializable {
	// Members
	private static final long serialVersionUID = -5616176897013108345L;
	private String username;
	private String password;

	// Default Constructor
	public JwtTokenRequest() {
		super();
	}

	// Override Constructor
	public JwtTokenRequest(String username, String password) {
		this.setUsername(username);
		this.setPassword(password);
	}

	// Getters
	public String getUsername() {
		return this.username;
	}
	public String getPassword() {
		return this.password;
	}

	// Setters
	public void setUsername(String username) {
		this.username = username;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}

