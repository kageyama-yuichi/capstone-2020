package com.l8z.user;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class PasswordResetToken {
	// Members
	// 10 Minute Expiration
	private static final int EXPIRATION = 1000 * 60 * 10;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    // Token that is sent to the User's Email
    private String token;
    private String username;
    private String expiryDate = (new SimpleDateFormat("h:mm a (dd/MM/yyyy)").format(new Date(new Date().getTime() + EXPIRATION))).toUpperCase();
    
	// Default Constructor
    public PasswordResetToken() {
    	
    }
    // Override Constructor
    public PasswordResetToken(String token, String username) {
    	this.token = token;
    	this.username = username;
    }
    
    // Getters
	public static int getExpiration() {
		return EXPIRATION;
	}
	public Long getId() {
		return id;
	}
	public String getToken() {
		return token;
	}
	public String getUsername() {
		return username;
	}
	public String getExpiryDate() {
		return expiryDate;
	}
	
	// Setters
	public void setId(Long id) {
		this.id = id;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public void setExpiryDate(String expiryDate) {
		this.expiryDate = expiryDate;
	}
}