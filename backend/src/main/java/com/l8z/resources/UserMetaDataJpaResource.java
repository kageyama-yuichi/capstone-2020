package com.l8z.resources;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.l8z.GlobalVariable;
import com.l8z.jparepository.UserMetaDataJpaRepository;
import com.l8z.user.UserMetaData;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController
public class UserMetaDataJpaResource {
	@Autowired
	private UserMetaDataJpaRepository repo;
	// Used to Read a JSON Document and Convert to Object
	private ObjectMapper json_mapper = new ObjectMapper();
	
	public void user_joined_org(String username, String org_id) {
		System.out.println("System - Saving Organisation to User's Name");
		// Stores all the org_ids of the User
		List<String> org_ids = new ArrayList<String>();
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores the users contact_list
		String contact_list = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
    		// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			// If its they haven't got any friends or joined any orgs, it will return null
    		if(sql != null) {
    			// Convert to List of Strings Object
        		org_ids = json_mapper.readValue(sql.get_org_ids(), 
        				json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
        		// Get the Current String
        		org_channels = sql.get_org_channels();
        		// Get the Current String
        		contact_list = sql.get_contact_list();
    		}  

    		// Add the new org_id
    		org_ids.add(org_id);
   
    		// Save it
    		repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids), org_channels, contact_list));
		}  catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		} 
	}
	
	public void user_leaves_org(String username, String org_id) {
		System.out.println("System - Removing Organisation from User's Name");
		// Stores all the org_ids of the User
		List<String> org_ids = new ArrayList<String>();
		// Stores all the org_channels of the User
		List<String> org_channels = new ArrayList<String>();
		// Stores the users contact_list
		String contact_list = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
    		// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			// Convert to List of Strings Object
    		org_ids = json_mapper.readValue(sql.get_org_ids(), 
    				json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
    		// Convert to List of Strings Object
    		org_channels = json_mapper.readValue(sql.get_org_channels(), 
    				json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
    		// Get Current Contact List
    		contact_list = sql.get_contact_list();

    		// Remove the org_id
    		org_ids.remove(org_id);
    		// Remove the org_id and it's Channels
    		for(int i=0; i<org_channels.size(); i++) {
    			// Checks if the starting is the org_id in question
    			if(org_channels.get(i).startsWith(org_id+".")) {
    				// if so, delete it
    				org_channels.remove(i);
    			}
    		}
   
    		// Save it
    		repo.save(new UserMetaData(
				username, 
				json_mapper.writeValueAsString(org_ids), 
				json_mapper.writeValueAsString(org_channels),
				contact_list
			));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		} 
	}
}
