package com.l8z.orgs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.orgs.Member;

@Repository
public interface MemberJpaRepository extends JpaRepository<Member, Long>{
	List<Member> findById(String username);
	List<Member> findAll();
}
