package com.l8z.user;

import javax.persistence.Column;
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
	@Column(length = 2000)
	private String bio;
	@Column(length = 100000)
	private String imagePath;

	// Default Constructor
	public User() {
		
	}
	
	// Override Constructor
	public User(String username, String fname, String lname, String email, String address, String password, String bio, String imagePath) {
		this.username = username;
		this.fname = fname;
		this.lname = lname;
		this.email = email;
		this.address = address;
		this.password = password;
		this.bio = bio;
		this.imagePath = imagePath;
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
	public String getBio() {
		return bio;
	}
	public String getImagePath() {
		return imagePath;
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
	public void setBio(String bio) {
		this.bio = bio;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	
	public void displayUser() {
		System.out.println("id: "+this.id);
		System.out.println("Username: "+this.username);
		System.out.println("First name: "+this.fname);
		System.out.println("Last Name: "+this.lname);
		System.out.println("Email: "+this.email);
		System.out.println("Address: "+this.address);
		System.out.println("Password: "+this.password);
		System.out.println("Bio: "+this.bio);
		System.out.println("imagePath: "+this.imagePath);
	}
	
	// Comparison 
	@Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        User comp = (User) o;
        return username.equals(comp.username);
    }
}
