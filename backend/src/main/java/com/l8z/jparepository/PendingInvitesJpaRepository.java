package com.l8z.jparepository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.l8z.pending.PendingInvites;

public interface PendingInvitesJpaRepository extends JpaRepository<PendingInvites, Long> {
	// Get all the User's Current Invites for Dashboard
	PendingInvites findByInvitee(String invitee);
	// Get all the Organisations Current Invites for Updating Orgs
	List<PendingInvites> findByOrgId(String orgId);
	// Deleting by the Unique Field
	void deleteByUniqueId(String uniqueId);
}
