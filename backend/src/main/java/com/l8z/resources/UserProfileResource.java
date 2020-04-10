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
import com.l8z.jparepository.UserProfileJpaRepository;
import com.l8z.user_profile.UserProfile;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class UserProfileResource {
	
	@Autowired
	private UserProfileJpaRepository repo;

	@GetMapping("/jpa/profile/{username}") 
	public UserProfile receiveUserProfile(@PathVariable String username){
		return repo.findByUsername(username);
	}
	
	@PostMapping("/jpa/profile/{username}")
	public ResponseEntity<Void> updateUserProfile(
			@PathVariable String username, 
			@RequestBody UserProfile prof
		){
		prof.setUsername(username);
		// Update Profile
		repo.save(prof);
		return ResponseEntity.noContent().build();
	}
}
