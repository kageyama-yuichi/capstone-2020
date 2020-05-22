package com.l8z;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.l8z.user.User;

class LandingTest {
	
	User user = new User();
	
	@BeforeEach
	void setup() {
		
		user.setUsername("hung");
		user.setPassword("Hung123!");
		
	}

	@Test
	public void usernamecheck() { //User name check
		assertEquals(user.getUsername(), "hung");
	}
	
	@Test
	public void passwordcheck() //Password check
	{
		assertEquals(user.getPassword(), "Hung123!");
		
	}
	
	
	@Test
	public void loginSuccess() //Login Success Test
	{
		boolean access = false; //Initially set to false so you can't login
		
		
		String userinputusername = "hung";
		String userinputpassword = "Hung123!";
		
		if (user.getUsername().equals(userinputusername)
				&& user.getPassword().equals(userinputpassword)) {
			access = true;
		}
		
		else {
			access = false;
		}
		
		
		assertEquals(user.getUsername(), userinputusername);
		assertEquals(user.getPassword(), userinputpassword);
		assertEquals(access,true);
	}
	
	@Test
	public void loginFail() //Login Fail Test
	{
		boolean access = false; //Initially set to false so you can't login
		
		String userinputusername = "hung";
		
		//Only the password input is false
		String userinputpassword = "Hung123";
		
		if (user.getUsername().equals(userinputusername)
				&& user.getPassword().equals(userinputpassword)) {
			access = true;
		}
		
		else {
			access = false;
		}
		assertEquals(user.getUsername(), userinputusername);
		assertNotEquals(user.getPassword(), userinputpassword);
		assertEquals(access,false);
	}

}
