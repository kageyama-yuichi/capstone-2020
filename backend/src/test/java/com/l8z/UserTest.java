package com.l8z;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

import com.l8z.user.User;

class UserTest {
	
	User user = new User();

	@Test
	public void FirstNameUpdate()
	{
		//Initial First Name is set and checked
		String fName = "Firstnameold";
		user.setFname(fName);
		
		assertEquals(user.getFname(), fName);
		
		//To see if changing First Name edits it properly
		fName = "Firstnamenew";
		user.setFname(fName);
		assertEquals(user.getFname(), fName);
	}
	
	@Test
	public void LastNameUpdate()
	{
		//Initial Last Name is set and checked
		String lName = "Lastnameold";
		user.setLname(lName);
		
		assertEquals(user.getLname(), lName);
		
		//To see if changing Last Name edits it properly
		lName = "Lastnamenew";
		user.setLname(lName);
		assertEquals(user.getLname(), lName);
		
	}
	
	@Test
	public void AddressUpdate()
	{
		//Initial Address is set and checked
		String address = "44 addressold";
		user.setAddress(address);
		
		assertEquals(user.getAddress(), address);
		
		//To see if changing Address edits it properly
		address = "Lastnamenew";
		user.setLname(address);
		assertEquals(user.getLname(), address);
		
	}
	
	@Test
	public void BioUpdate()
	{
		//Initial Bio is set and checked
		String bio = "Hi this is my old bio";
		user.setBio(bio);
		
		assertEquals(user.getBio(), bio);
		
		//To see if changing Bio edits it properly
		bio = "Hi this is my new bio";
		user.setBio(bio);
		assertEquals(user.getBio(), bio);
		
	}

}
