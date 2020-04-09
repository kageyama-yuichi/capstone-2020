package com.l8z.resources;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.l8z.GlobalVariable;
import com.l8z.jparepository.OrgsJpaRepository;
import com.l8z.orgs.Channels;
import com.l8z.orgs.Members;
import com.l8z.orgs.Orgs;
import com.l8z.orgs.Sql;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController
public class OrgsJpaResource {
	@Autowired
	private OrgsJpaRepository orgsjpa;
	// Used to Read a JSON Document and Convert to Object
	private ObjectMapper json_mapper = new ObjectMapper();
	
	@GetMapping("jpa/orgs/{username}")
	public List<Orgs> retrieve_orgs(@PathVariable String username) {
		System.out.println("System - Retrieving Orgs");
		List<Orgs> users_orgs = new ArrayList<Orgs>();
		
		try {
    		// Convert to Sql Object
			List<Sql> temp_sql = orgsjpa.findAll(); 
			for(int i=0; i<temp_sql.size(); i++) {
				Orgs temp_org = json_mapper.readValue(temp_sql.get(i).get_data(), Orgs.class);
				
				// For This, the Role of the Member Does Not Matter As Comparison is between username
				if(temp_org.has_member(new Members(username, Members.Role.ORG_OWNER))) {
					temp_org.clear_channel();
					users_orgs.add(temp_org);
				}
			}
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		return users_orgs;
	}
	
	@GetMapping("jpa/orgs/{username}/new")
	public List<String> retrieve_all_orgs(@PathVariable String username) {
		System.out.println("System - Retrieving All Orgs");
		List<Sql> temp_sql = orgsjpa.findAll(); 
		List<String> org_id_namespace = new ArrayList<String>();
		
		for(int i=0; i<temp_sql.size(); i++) {
			org_id_namespace.add(temp_sql.get(i).get_id());
		}
		
		return org_id_namespace;
	}
	
	@GetMapping("jpa/orgs/{username}/{org_id}")
	public Orgs retrieve_org(@PathVariable String username, @PathVariable String org_id) {
		System.out.println("System - Retrieving User's Org");
		Orgs users_org = null;
		
		try {
    		// Convert to Sql Object
			Sql temp_sql = orgsjpa.getByOrgId(org_id); 
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			
			// Find the User
			for(int i=0; i<temp_org.get_members().size(); i++) {
				Members temp_member = temp_org.get_members().get(i);
				// This Comparison Only Checks for Username
				if(temp_member.equals(new Members(username, Members.Role.ORG_OWNER))){
					// Are they the ORG_OWNER or ADMIN?
					if(temp_member.get_role() == Members.Role.ORG_OWNER /*|| temp_member.get_role() == Members.Role.ADMIN*/) {
						System.out.println("System - Org Owner or Admin Found");
						users_org = temp_org;
					}
				} 
			}
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		return users_org;
	}
	
	
	@PostMapping("jpa/orgs/{username}/new")
	public ResponseEntity<Void> create_org(@PathVariable String username, @RequestBody Orgs org) {
		System.out.println("System - Creating Org");
		
		// Assign the ORG_OWNER to the Creator
		org.add_member(new Members(username, Members.Role.ORG_OWNER));
		// Save the Org
		Sql sql = null;
		try {
			sql = new Sql(org.get_org_id(), json_mapper.writeValueAsString(org));
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Creating Org");
		}
		orgsjpa.save(sql);
		
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping(value="/jpa/orgs/{username}/{org_id}")
	public ResponseEntity<Void> update_org(
			@PathVariable String username,
			@PathVariable String org_id, 
			@RequestBody Orgs org
		){
		
		// Save the Org
		Sql sql = null;
		try {
			sql = new Sql(org.get_org_id(), json_mapper.writeValueAsString(org));
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Org");
		}
		
		// If the ID's are the Same, Save, Else Delete then Save
		if(!org_id.equals(org.get_org_id())) {
			orgsjpa.deleteById(org_id);
		}
		orgsjpa.save(sql);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("jpa/orgs/{username}/{org_id}")
	public ResponseEntity<Void> delete_org(@PathVariable String username, @PathVariable String org_id) {
		System.out.println("System - Delete Org");
		// First Get the Organisation
		Sql temp_sql = orgsjpa.getByOrgId(org_id);
		// Check if the Requestor is the ORG_OWNER
		boolean org_owner = false;
		try {
    		// Convert to Orgs Object
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Find the User
			for(int i=0; i<temp_org.get_members().size(); i++) {
				// This Comparison Only Checks for Username
				if(temp_org.get_members().get(i).equals(new Members(username, Members.Role.ORG_OWNER))){
					// Are they the ORG_OWNER?
					if(temp_org.get_members().get(i).get_role() == Members.Role.ORG_OWNER) {
						System.out.println("System - Org Owner Found");
						org_owner = true;
					}
				} 
			}
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// If they are the ORG_OWNER, then Delete :)
		if(org_owner) {
			orgsjpa.deleteById(org_id);
		}
		return ResponseEntity.noContent().build();
	}
}
