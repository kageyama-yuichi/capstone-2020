package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.user.UserMetaData;

@Repository
public interface UserMetaDataJpaRepository extends JpaRepository<UserMetaData, String>  {
	UserMetaData findByUsername(String username);
}