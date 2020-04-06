package com.l8z.orgs;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Sql {
	@Id
	@GeneratedValue
	Long id;
	String data;
	
	// Getters
	public Long get_id() {
		return id;
	}
	public String get_data() {
		return data;
	}
	/*
	public Orgs get_object() {
		
	}
	*/
	// Setters
	public void set_id(Long id) {
		this.id = id;
	}

	
}
