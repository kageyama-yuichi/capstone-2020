package com.l8z.jparepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.l8z.user.BasicUser;
import com.l8z.user.User;

@Repository
public interface UserJpaRepository extends JpaRepository<User, Long> {
	User findByUsername(String username);
	User findUserByEmail(String email);
	// A Custom Query to Return All Users with a Name
	@Query("SELECT u FROM User u WHERE LOWER(CONCAT(TRIM(u.fname), ' ', TRIM(u.lname))) LIKE %?1%")
	List<BasicUser> searchByName(String name);
}
