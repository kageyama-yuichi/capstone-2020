package com.l8z.todos;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;

@Entity
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class OrgTodo {
	// Members
	@Id
	@GeneratedValue
	@JsonProperty("id") private Long id;
    @Column(name="org_id")
	@JsonProperty("org_id") private String orgId;
    @Column(name="org_channel") // org_id+"."+channel_title
	@JsonProperty("org_channel") private String orgChannel;
	@JsonProperty("desc") private String desc;
	@JsonProperty("date") private String date;
	@JsonProperty("color") private String color;
	

	@JsonProperty("status") private boolean status = false;
	
	// Default Constructor
	public OrgTodo () {
		
	}

	// Constructor
	public OrgTodo (String orgId, String orgChannel, String desc, String date, String color, boolean status) {
		this.orgId = orgId;
		this.orgChannel = orgChannel;
		this.desc = desc;
		this.date = date;
		this.color = color; 
		this.status = status;
	}

	// Getters
	public Long get_id() {
		return id;
	}
	public String getOrgId() {
		return orgId;
	}
	public String getOrgChannel() {
		return orgChannel;
	}
	public String get_desc() {
		return desc;
	}
	public String get_date() {
		return date;
	}
	public String getColor() {
		return color;
	}
	public boolean get_status() {
		return status;
	}

	// Setters
	public void set_id(Long id) {
		this.id = id;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public void setOrgChannel(String orgChannel) {
		this.orgChannel = orgChannel;
	}
	public void set_desc(String desc) {
		this.desc = desc;
	}
	public void set_date(String date) {
		this.date = date;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public void set_status(boolean status) {
		this.status = status;
	}

	// Comparison
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
		OrgTodo comp = (OrgTodo) o;
		if (id != comp.id)
			return false;
		return true;
	}	
}