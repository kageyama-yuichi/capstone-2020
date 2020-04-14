package com.l8z.user_profile;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="userprofile")
public class UserProfile {
	// Members
	@Id
	private String username;
	private String fname;
	private String lname;
	private String address;
	@Column(length = 2000)
	private String bio;
	@Column(length = 100000)
	private String imagePath;
	
	// Default Constructor
	public UserProfile() {
		
	}
	
	// Constructor
	public UserProfile(String username, String fname, String lname, String address, String bio, String imagePath) {
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.address = address;
		this.bio = bio;
		this.imagePath = imagePath;
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
	public String getAddress() {
		return address;
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
	public void setAddress(String address) {
		this.address = address;
	}
	public void setBio(String bio) {
		this.bio = bio;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	
	// Comparison 
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        UserProfile comp = (UserProfile) o;
        return username.equals(comp.username);
    }
}
