package com.l8z.user;

public class BasicUser {
	private String username;
	private String fname;
	private String lname;
	private String bio;
	private String imagePath;
	
	
	public BasicUser() {
		
	}
	
	public BasicUser(String username, String fname, String lname, String bio, String imagePath) {
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.bio = bio;
		this.imagePath = imagePath;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public String getImagePath() {
		return imagePath;
	}

	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	
}
