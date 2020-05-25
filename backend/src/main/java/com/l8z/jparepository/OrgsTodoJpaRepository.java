package com.l8z.jparepository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.l8z.todos.OrgTodo;

@Repository
public interface OrgsTodoJpaRepository extends JpaRepository<OrgTodo, Long> {
	// Used to fetch the Users' Channels' Todos
	List<OrgTodo> getByOrgChannel(String orgChannel);

	// Deleting by the OrgId
	@Transactional
	@Modifying
	@Query("delete from OrgTodo o where o.orgId = ?1")
	void deleteByOrgId(String orgId);
}
