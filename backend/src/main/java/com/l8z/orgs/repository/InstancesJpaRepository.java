package com.l8z.orgs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.orgs.Instances;

@Repository
public interface InstancesJpaRepository extends JpaRepository<Instances, Long>{
	List<Instances> findById(String instance_title);
	List<Instances> findAll();
}
