package com.l8z.todos;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@Entity
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class Todo {
	// Members
	@Id
	@GeneratedValue
	@JsonProperty("id") private Long id;
	@JsonProperty("username") private String username;
	@JsonProperty("desc") private String desc;
	@JsonProperty("date") private String date;
	@JsonProperty("status") private boolean status = false;
	
	// Default Constructor
	public Todo() {
		
	}

	// Constructor
	public Todo(String username, String desc, String date, boolean status) {
		this.username = username;
		this.desc = desc;
		this.date = date;
		this.status = status;
	}

	// Getters
	public Long get_id() {
		return id;
	}
	public String get_username() {
		return username;
	}
	public String get_desc() {
		return desc;
	}
	public String get_date() {
		return date;
	}
	public boolean get_status() {
		return status;
	}

	// Setters
	public void set_id(Long id) {
		this.id = id;
	}
	public void set_username(String username) {
		this.username = username;
	}
	public void set_desc(String desc) {
		this.desc = desc;
	}
	public void set_date(String date) {
		this.date = date;
	}
	public void set_status(boolean status) {
		this.status = status;
	}

	// Comparison
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
		Todo comp = (Todo) o;
		if (id != comp.id)
			return false;
		return true;
	}	
}