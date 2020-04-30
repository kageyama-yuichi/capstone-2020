package com.l8z.jparepository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.l8z.pending.PendingInvites;

public interface PendingInvitesJpaRepository extends JpaRepository<PendingInvites, Long> {
	// Get all the User's Current Invites for Dashboard
	List<PendingInvites> findByInvitee(String invitee);
	// Get all the Organisations Current Invites for Updating Orgs
	List<PendingInvites> findByOrgId(String orgId);
	// Get By UniqueID
	PendingInvites findByUniqueId(String uniqueId);
	
	// Deleting by the Unique Field
	@Transactional
	@Modifying
	@Query("delete from PendingInvites p where p.uniqueId = ?1")
	void deleteByUniqueId(String uniqueId);
	
	
}
