package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l8z.user_profile.UserProfile;

public interface UserProfileJpaRepository extends JpaRepository<UserProfile, String> {
	UserProfile findByUsername(String username);
}
