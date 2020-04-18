package com.l8z.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.orgs.OrgsSQL;

@Repository
public interface OrgsJpaRepository extends JpaRepository<OrgsSQL, String>{
	OrgsSQL getByOrgId(String orgId);
}
