package com.l8z.user;

public class BasicUser {
	// Members
	private String username;
	private String fname;
	private String lname;
	private String bio;
	private String imagePath;
	
	// Default Constructor
	public BasicUser() {
		
	}
	
	// Override Constructor
	public BasicUser(String username, String fname, String lname, String bio, String imagePath) {
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.bio = bio;
		this.imagePath = imagePath;
	}
	
	// Override Constructor
	public BasicUser(User user) {
		this.username = user.getUsername();
		this.fname = user.getFname();
		this.lname = user.getLname();
		this.bio = user.getBio();
		this.imagePath = user.getImagePath();
		
	}

	// Getters
	public String getUsername() {
		return username;
	}
	public String getFname() {
		return fname;
	}
	public String getLname() {
		return lname;
	}
	public String getBio() {
		return bio;
	}
	public String getImagePath() {
		return imagePath;
	}

	// Setters
	public void setUsername(String username) {
		this.username = username;
	}
	public void setFname(String fname) {
		this.fname = fname;
	}
	public void setLname(String lname) {
		this.lname = lname;
	}
	public void setBio(String bio) {
		this.bio = bio;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
}
