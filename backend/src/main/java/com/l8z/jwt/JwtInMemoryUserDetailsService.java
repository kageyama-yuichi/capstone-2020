package com.l8z.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.l8z.jparepository.UserJpaRepository;
import com.l8z.user.User;

@Service
public class JwtInMemoryUserDetailsService implements UserDetailsService {

	@Autowired
	private UserJpaRepository repo;

	@Autowired
	private PasswordEncoder bCryptEncoder;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = repo.findByUsername(username);
		if (user == null) {
			throw new UsernameNotFoundException(String.format("USER_NOT_FOUND '%s'.", username));
		}

		return new JwtUserDetails(user.getID(), user.getUsername(), user.getPassword(), "ROLE_USER");
	}

	// Checks if the User Exists
	public boolean checkIfUserExists(String username) {
		User toCheck = repo.findByUsername(username);
		// Null Check
		if (toCheck == null) {
			return false;
		} else {
			return true;
		}
	}

	// Encrypt user password
	public User save(User user) {		
		user.setPassword(bCryptEncoder.encode(JwtPasswordDecryption.decrypt(user.getPassword(), "L8Z")));
		return repo.save(user);
	}
}


