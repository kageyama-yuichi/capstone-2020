package com.l8z.resources;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.PasswordRecoveryJpaRepository;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.user.BasicUser;
import com.l8z.user.PasswordResetToken;
import com.l8z.user.User;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class UserJpaResource {
	@Autowired
	private UserJpaRepository repo;
	@Autowired
	private PasswordRecoveryJpaRepository prrepo;
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
	
	@PostMapping("/user/password/reset")
	public boolean resetPassword(@RequestParam("email") String email) {
	    // Ensure the User Exists
		User user = repo.findUserByEmail(email);
	    if (user == null) {
	        System.out.println("System - Email Specified Is Not Associated to an Account!");
	        return false;
	    } else {
	    // Create the Token for the User to Reset their Password
	    String token = UUID.randomUUID().toString();
	    // Save the Token to the Database
	    prrepo.save(new PasswordResetToken(token, user.getUsername()));
	    // Create the Simple Mail Message and Set the Email, Subject and Message
	    SimpleMailMessage msg = new SimpleMailMessage();
	    // Set the Email
        msg.setTo(email);
        // Set the Subject
        msg.setSubject("L8Z - Password Reset for "+user.getUsername());
        String url = GlobalVariable.L8Z_URL + "/user/password/change?username="+user.getUsername()+"&token="+token;
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
	
	@GetMapping("/jpa/retrieve/user/{name}")
	public List<BasicUser> retrieve_all_basic_users_by_name(@PathVariable String name) {
		return repo.searchByName(name.toLowerCase());
	}
	@GetMapping("/jpa/retrieve/all/user/names")
	public List<String> retrieve_all_name_space(){
		return repo.retrieveAllNames();
	}
}
