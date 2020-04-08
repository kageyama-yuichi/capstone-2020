package com.l8z.orgs.jparepository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.orgs.Sql;

@Repository
public interface OrgsJpaRepository extends JpaRepository<Sql, String>{
	Sql getByOrgId(String orgId);
}
