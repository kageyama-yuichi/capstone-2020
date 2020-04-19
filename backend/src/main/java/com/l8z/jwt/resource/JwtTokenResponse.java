package com.l8z.jwt.resource;

import java.io.Serializable;

public class JwtTokenResponse implements Serializable {
	// Members
	private static final long serialVersionUID = 8317676219297719109L;
	private final String token;

	// Constructor
	public JwtTokenResponse(String token) {
		this.token = token;
	}

	// Getter
	public String getToken() {
		return this.token;
	}
}