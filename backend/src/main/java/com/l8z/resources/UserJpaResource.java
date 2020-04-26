package com.l8z.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.PasswordRecoveryJpaRepository;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.user.User;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class UserJpaResource {
	
	@Autowired
	private UserJpaRepository repo;
	@Autowired
	private PasswordRecoveryJpaRepository prrepo;
	
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
	public ResponseEntity<Void> resetPassword(
			HttpServletRequest request, 
			@RequestParam("email") String userEmail
		) {
	    User user = userService.findUserByEmail(userEmail);
	    if (user == null) {
	        throw new UserNotFoundException();
	    }
	    String token = UUID.randomUUID().toString();
	    userService.createPasswordResetTokenForUser(user, token);
	    mailSender.send(constructResetTokenEmail(getAppUrl(request), 
	      request.getLocale(), token, user));
	    return new GenericResponse(
	      messages.getMessage("message.resetPasswordEmail", null, 
	      request.getLocale()));
	}
}
