package com.l8z.orgs.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.l8z.orgs.Channels;
import com.l8z.orgs.Orgs;

@Repository
public interface ChannelsJpaRepository extends JpaRepository<Channels, Long>{
	List<Channels> findById(String channel_title);
	List<Channels> findAll();
}
