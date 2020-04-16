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
import com.l8z.orgs.Instances;
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
	
	@GetMapping("jpa/orgs/{username}/{org_id}/new")
	public List<String> retrieve_all_channel_titles(@PathVariable String username, @PathVariable String org_id) {
		System.out.println("System - Retrieving All Channels in the Org");

		Orgs users_org = null;
		List<Channels> channel_list = new ArrayList<Channels>();
		List<String> channel_title_namespace = new ArrayList<String>();
		
		try {
    		// Convert to Sql Object
			Sql temp_sql = orgsjpa.getByOrgId(org_id); 
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Get the Channel List
			channel_list = temp_org.get_channels();
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// Get the Namespace
		for(int i=0; i<channel_list.size(); i++) {
			channel_title_namespace.add(channel_list.get(i).get_channel_title());
		}
		
		return channel_title_namespace;
	}
	
	@PostMapping("jpa/orgs/{username}/{org_id}/new")
	public ResponseEntity<Void> create_channel(
			@PathVariable String username,
			@PathVariable String org_id,
			@RequestBody Channels channel
		) {
		System.out.println("System - Creating Channel");
		
		Sql sql = null;
		Orgs temp_org = null;
		try {
			// Convert to Sql Object
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			
			// Assign the ORG_OWNER to the Channel
			channel.set_owner(new Members(username, temp_org.retrieve_member(username).get_role()));
			// Add the Channel
			temp_org.add_channel(channel);
			
			sql = new Sql(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org));
			
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Creating Org");
		}
		// Save the Org
		orgsjpa.save(sql);
		
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping(value="/jpa/orgs/{username}/{org_id}/{channel_title}")
	public ResponseEntity<Void> update_channel(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@RequestBody Channels channel
		){
		
		Sql sql = null;
		Orgs temp_org = null;

		try {
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			
			// Check if channel_title Changes
			if(!temp_org.retrieve_channel(channel_title).equals(channel.get_channel_title())) {
				// Remove the Old Channel
				temp_org.remove_channel(temp_org.retrieve_channel(channel_title));
				// Add the New Channel
				temp_org.add_channel(channel);
			}
			
			// Convert to Sql Object
			sql = new Sql(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org));
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Org");
		}
		
		// Save the Org
		orgsjpa.save(sql);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("jpa/orgs/{username}/{org_id}/{channel_title}")
	public ResponseEntity<Void> delete_channel(
			@PathVariable String username, 
			@PathVariable String org_id,
			@PathVariable String channel_title
		) {
		System.out.println("System - Delete Channel");
		// First Get the Organisation
		Sql sql = null;
		Orgs temp_org = null;
		
		Sql temp_sql = orgsjpa.getByOrgId(org_id);
		
		// Check if the Requestor is the ORG_OWNER And OWNER of Channel
		boolean org_owner = false;
		try {
    		// Convert to Orgs Object
			temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Check if the User is the ORG_OWNER
			if(temp_org.retrieve_member(username).get_role() == Members.Role.ORG_OWNER) {
				org_owner = true;
			}
			// Just Making Lines Smaller
			Members channel_owner = temp_org.retrieve_channel(channel_title).get_owner();
			Members temp_member = new Members(username, Members.Role.ORG_OWNER);
			
			// If the Channel Owner is Equal to the Temp Member or ORG_OWNER
			if(channel_owner.equals(temp_member) || org_owner) {
				// Remove the Channel
				temp_org.remove_channel(temp_org.retrieve_channel(channel_title));
			}
			
			// Convert to Sql Object
			sql = new Sql(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// Update the Organisation
		orgsjpa.save(sql);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("jpa/orgs/{username}/{org_id}/{channel_title}/new")
	public List<String> retrieve_all_instance_titles(@PathVariable String username, @PathVariable String org_id,  @PathVariable String channel_title) {
		System.out.println("System - Retrieving All Instances in the Org");

		Orgs users_org = null;
		List<Instances> instance_list = new ArrayList<Instances>();
		List<String> instance_title_namespace = new ArrayList<String>();
		
		try {
    		// Convert to Sql Object
			Sql temp_sql = orgsjpa.getByOrgId(org_id); 
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Get the Channel List
			instance_list = temp_org.get_instance();
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// Get the Namespace
		for(int i=0; i<instance_list.size(); i++) {
			instance_title_namespace.add(instance_list.get(i).get_instance_title());
		}
		
		return instance_title_namespace;
	}
	
	@PostMapping("jpa/orgs/{username}/{org_id}/{channel_title}/new")
	public ResponseEntity<Void> create_instance(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@RequestBody Instances instance
		) {
		System.out.println("System - Creating Instance");
		
		Sql sql = null;
		Orgs temp_org = null;
		try {
			// Convert to Sql Object
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			
			// Add the Instance
			temp_org.add_instance(instance);
			
			sql = new Sql(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org));
			
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Creating Instance");
		}
		// Save the Org
		orgsjpa.save(sql);
		
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping(value="/jpa/orgs/{username}/{org_id}/{channel_title}/{instance_title}")
	public ResponseEntity<Void> update_instance(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@PathVariable String instance_title,
			@RequestBody Instances instance
		){
		
		Sql sql = null;
		Orgs temp_org = null;

		try {
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			
			// Check if instance_title Changes
			if(!temp_org.retrieve_instance(instance_title).equals(instance.get_instance_title())) {
				// Remove the Old Instance
				temp_org.remove_instance(temp_org.retrieve_instance(instance_title));
				// Add the New Instance
				temp_org.add_instance(instance);
			}
			
			// Convert to Sql Object
			sql = new Sql(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org));
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Instance");
		}
		
		// Save the Org
		orgsjpa.save(sql);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("jpa/orgs/{username}/{org_id}/{channel_title}/{instance_title}")
	public ResponseEntity<Void> delete_instance(
			@PathVariable String username, 
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@PathVariable String instance_title
		) {
		System.out.println("System - Delete Instance");
		// First Get the Organisation
		Sql sql = null;
		Orgs temp_org = null;
		
		Sql temp_sql = orgsjpa.getByOrgId(org_id);
		
		// Check if the Requestor is the ORG_OWNER And OWNER of Channel
		boolean org_owner = false;
		try {
    		// Convert to Orgs Object
			temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			temp_org.remove_instance(temp_org.retrieve_instance(instance_title));
			
			// Convert to Sql Object
			sql = new Sql(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// Update the Organisation
		orgsjpa.save(sql);
		return ResponseEntity.noContent().build();
	}
	
}
