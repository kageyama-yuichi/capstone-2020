package com.l8z.orgs.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l8z.orgs.Sql;

public interface OrgsJpaRepository extends JpaRepository<Sql, String>{
	Sql getByOrgId(String orgId);
}
