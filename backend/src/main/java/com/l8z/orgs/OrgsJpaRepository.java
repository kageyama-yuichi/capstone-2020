package com.l8z.orgs;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrgsJpaRepository extends JpaRepository<Orgs, Long>{
	List<Orgs> findById(String org_id);
	List<Orgs> findAll();
}
