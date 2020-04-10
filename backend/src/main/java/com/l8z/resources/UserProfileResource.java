package com.l8z.resources;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.UserProfileJpaRepository;
import com.l8z.user_profile.UserProfile;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController 
public class UserProfileResource {
	
	@Autowired
	private UserProfileJpaRepository repo;

	@GetMapping("jpa/profile") 
	public UserProfile receiveUserProfile(String username){
		return repo.findByUsername(username);
	}
	
	/*public List<UserProfile> listAll(){
	//	return repo.findAll();
	}
	
	public void save (UserProfile userprofile){
	//	repo.save(userprofile);
	}
	
	public void delete(Long id){
		//repo.deleteById(id);
	}*/
}
