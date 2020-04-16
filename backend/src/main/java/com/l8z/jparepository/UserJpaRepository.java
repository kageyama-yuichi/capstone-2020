package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l8z.user_profile.User;

public interface UserJpaRepository extends JpaRepository<User, String> {
	User findByUsername(String username);
}
