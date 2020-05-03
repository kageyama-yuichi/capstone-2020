package com.l8z.jparepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.todos.OrgTodo;

@Repository
public interface OrgsTodoJpaRepository extends JpaRepository<OrgTodo, Long>{
	// Used to fetch the Users' Channels' Todos 
	List<OrgTodo> getByOrgChannel(String orgChannel);
	// Return the number of Deleted
	long deleteByOrgId(String orgId);
}
