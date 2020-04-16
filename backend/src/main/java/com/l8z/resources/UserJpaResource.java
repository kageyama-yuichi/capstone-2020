package com.l8z.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.user_profile.User;

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
}
