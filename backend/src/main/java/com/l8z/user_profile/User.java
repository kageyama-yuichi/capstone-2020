package com.l8z.user_profile;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {
	// Members of Table
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String username;
	private String fname;
	private String lname;
	private String email;
	private String address;
	private String password;

	// Default Constructor
	public User() {
		
	}
	
	// Override Constructor
	public User(String username, String fname, String lname, String email, String address, String password) {
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.email = email;
		this.address = address;
		this.password = password;
	}
	
	// Getters
	public Long getID() {
		return id;
	}
	public String getUsername() {
		return username;
	}
	public String getFname() {
		return fname;
	}
	public String getLname() {
		return lname;
	}
	public String getEmail() {
		return email;
	}
	public String getAddress() {
		return address;
	}
	public String getPassword() {
		return password;
	}
	
	// Setters
	public void setID(Long id) {
		this.id = id;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public void setFname(String fname) {
		this.fname = fname;
	}
	public void setLname(String lname) {
		this.lname = lname;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public void setPassword(String password) {
		this.password = password;
	}
}
