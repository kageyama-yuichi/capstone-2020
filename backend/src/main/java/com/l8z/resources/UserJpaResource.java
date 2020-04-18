package com.l8z.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.user.User;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class UserJpaResource {
	
	@Autowired
	private UserJpaRepository repo;
	
	@PostMapping("/jpa/register/{username}")
	public ResponseEntity<Void> registerUser(
			@PathVariable String username, 
			@RequestBody User inboundUser
		){
		inboundUser.setUsername(username);
		// Update Profile
		repo.save(inboundUser);
		return ResponseEntity.noContent().build();
	}
	
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
}
