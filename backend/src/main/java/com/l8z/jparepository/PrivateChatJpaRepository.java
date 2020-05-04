package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.chat.PrivateChatSQL;

@Repository
public interface PrivateChatJpaRepository extends JpaRepository<PrivateChatSQL, String>{
	PrivateChatSQL getById(String id);
}
