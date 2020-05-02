package com.l8z.resources;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.PasswordRecoveryJpaRepository;
import com.l8z.jparepository.PendingInvitesJpaRepository;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.jwt.JwtPasswordDecryption;
import com.l8z.pending.PendingInvites;
import com.l8z.user.BasicUser;
import com.l8z.user.PasswordResetToken;
import com.l8z.user.User;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class UserJpaResource {
	private static final int DATE_LEN = 12;
	private static final int ABB_LEN = 15;
	private static final int TIME_LEN = 16;
	
	@Autowired
	private UserJpaRepository repo;
	@Autowired
	private PasswordRecoveryJpaRepository prrepo;
	@Autowired
	private PendingInvitesJpaRepository pendingjpa;
	@Autowired
	private PasswordEncoder bCryptEncoder;
	@Autowired
    private JavaMailSender mail;
	
	@GetMapping("/jpa/profile/{username}") 
	public User receiveUserProfile(@PathVariable String username){		
		return repo.findByUsername(username);
	}
	
	@PostMapping("/jpa/profile/{username}")
	public ResponseEntity<Void> updateUserProfile(
			@PathVariable String username, 
			@RequestBody User profile
		){
		User userUpdate = repo.getOne(profile.getID());
		// Future Updates Possibly?
		//userUpdate.setUsername(profile.getUsername());
		//userUpdate.setPassword(profile.getPassword());
		//userUpdate.setEmail(profile.getEmail());
		
		userUpdate.setFname(profile.getFname());
		userUpdate.setLname(profile.getLname());
		userUpdate.setFname(profile.getFname());
		userUpdate.setAddress(profile.getAddress());		
		userUpdate.setBio(profile.getBio());
		userUpdate.setImagePath(profile.getImagePath());

		//userUpdate.displayUser();
		// Update Profile
		repo.save(userUpdate);
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/jpa/user/password/reset/{email}")
	public boolean sendTokenForResetPassword(@PathVariable("email") String email) {
	    // Ensure the User Exists
		User user = repo.findUserByEmail(email);
	    if (user == null) {
	        System.out.println("System - Email Specified Is Not Associated to an Account!");
	        return false;
	    } else {
	    // Create the Token for the User to Reset their Password
	    String token = UUID.randomUUID().toString();
	    // Check if the User Already has a Token
	    PasswordResetToken check = prrepo.findByUsername(user.getUsername());
	    // if a Password Reset Token was already created, Deleted it and make a New One
	    if(check != null) {
	    	prrepo.deleteById(check.getId());
	    }
	    // Save the Token to the Database
	    prrepo.save(new PasswordResetToken(token, user.getUsername()));
	    // Create the Simple Mail Message and Set the Email, Subject and Message
	    SimpleMailMessage msg = new SimpleMailMessage();
	    // Set the Email
        msg.setTo(email);
        // Set the Subject
        msg.setSubject("L8Z - Password Reset for "+user.getUsername());
        String url = GlobalVariable.L8Z_URL + "/recover/password/"+token;
        // Set the Body Content
        msg.setText(
    		"Hello "+user.getFname()+" "+user.getLname()+",\n\n"
    		+ "Your L8Z account has requested a recovery of password. If this was not you, please ignore this email.\n"
    		+ url + "\n\n"
    		+ "Thank you for choosing L8Z,\n L8Z Team."
    	);
        
        // Send the Email
        mail.send(msg);
	    return true;
	    }
	}
	@PostMapping("/jpa/check/password/reset/token/{token}")
	public PasswordResetToken checkPasswordResetToken(@PathVariable String token) {
		PasswordResetToken check = prrepo.findByToken(token);
		// Comparing the the Current Time Date and Token Time Date
		String cTD = (new SimpleDateFormat("h:mm a (dd/MM/yyyy)").format(new Date())).toUpperCase();
		String tTD = check.getExpiryDate();		
		
		return check;
	}
	@PostMapping("/jpa/profile/{username}/{password}/{token}")
	public boolean updateUserPassword(
			@PathVariable String username,
			@PathVariable String password,
			@PathVariable String token
		) {
		User user = repo.findByUsername(username);
		boolean success = false;
		
		// if a Token was present, immediately update password
		if(!token.equals("")) {
			user.setPassword(bCryptEncoder.encode(JwtPasswordDecryption.decrypt(password,"L8Z")));
			success = true;
		} else {
			user.setPassword(bCryptEncoder.encode(JwtPasswordDecryption.decrypt(password,"L8Z")));
			success = true;
		}
		
		// Save User
		repo.save(user);
		if(success) {
			return true;
		} else {
			return false;
		}
	}
	
	@GetMapping("/jpa/retrieve/user/{name}")
	public List<BasicUser> retrieve_all_basic_users_by_name(@PathVariable String name) {
		return repo.searchByName(name.toLowerCase());
	}
	@GetMapping("/jpa/retrieve/all/user/names")
	public List<String> retrieve_all_name_space(){
		return repo.retrieveAllNames();
	}
	 // Get all the Users' Pending Invites
    @GetMapping("jpa/user/{username}/pending/invites")
    public List<PendingInvites> retrieve_pending_invites_for_user(@PathVariable String username) {    	
    	// Retrieve all the Pending Invites
    	return pendingjpa.findByInvitee(username);
    }
    @PostMapping("jpa/basic/users")
    public List<BasicUser> retrieve_basic_user(@RequestBody String[] usernames) {
    	List<BasicUser> inviter_basic_users = new ArrayList<BasicUser>();
    	for(int i=0; i<usernames.length; i++) {
    		inviter_basic_users.add(repo.getByUsername(usernames[i]));
    	}
    	return inviter_basic_users;
    }
    
    // Helper Method: Uses the Current/Token Time Dates to Determine Expiration of Token
    public String checkTimeAbbDate(String cTD, String tTD) {
    	String ret = "";
    	// Compare the Dates of the Current Time vs Token Set Time
		String dateOne = cTD.substring(cTD.length()-DATE_LEN, cTD.length());
        String dateTwo = tTD.substring(tTD.length()-DATE_LEN, tTD.length());
        // Compare the Abbreivation (AM/PM)
        String dateOneAbb = cTD.substring(cTD.length()-ABB_LEN, cTD.length()-DATE_LEN-1);
        String dateTwoAbb = tTD.substring(tTD.length()-ABB_LEN, tTD.length()-DATE_LEN-1);
        // Compare the Times (0: Hour, 1: Minutes)
        String[] dateOneTime = (cTD.substring(0, cTD.length()-TIME_LEN)).split(":");
        String[] dateTwoTime = (tTD.substring(0, tTD.length()-TIME_LEN)).split(":");
        
        // if they are the Same Date, Check Abbreivation (AM/PM) 
        if(dateOne.compareTo(dateTwo) == 0) {
        	// If they are the Same Abbreviation, Check the Time
        	if(dateOneAbb.compareTo(dateTwoAbb) == 0) {
        		// Check if the Hours are the Same
        		if(dateOneTime[0].compareTo(dateTwoTime[0]) == 0) {
        			// Check if the Ten's Minute is the Same
        			if(dateOneTime[1].substring(0,1).compareTo(dateTwoTime[1].substring(0,1)) == 0) {
        				ret = "valid";
        			} else {
        				
        			}
        		} 
        		// Boundary Condition for 1 Hour Difference (xx:59)
        		else {
        			
        		}
                
        	} 
        	// Boundary Condition for Mid Day (AM -> PM)
        	else {
        		
        	}
        }
        // Boundary Condition for Midnight
        else if(dateOne.compareTo(dateTwo) == -1) {
        	
        } else {
        	// The Current or Time Expiry Date is Invalid 
        	ret = "invalid";
        }
        return ret;
    }
}
