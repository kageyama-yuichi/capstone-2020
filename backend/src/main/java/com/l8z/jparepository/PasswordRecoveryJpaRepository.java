package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.user.PasswordResetToken;

@Repository
public interface PasswordRecoveryJpaRepository  extends JpaRepository<PasswordResetToken, Long>{
	PasswordResetToken findByToken(String token);
	PasswordResetToken findByUsername(String username);
}
