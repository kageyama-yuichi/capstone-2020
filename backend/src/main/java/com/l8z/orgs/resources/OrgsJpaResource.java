package com.l8z.orgs.resources;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.l8z.GlobalVariable;
import com.l8z.orgs.Members;
import com.l8z.orgs.Orgs;
import com.l8z.orgs.Sql;
import com.l8z.orgs.jparepository.OrgsJpaRepository;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController
public class OrgsJpaResource {
	@Autowired
	private OrgsJpaRepository orgsjpa;
	// Used to Read a JSON Document and Convert to Object
	private ObjectMapper json_mapper = new ObjectMapper();
	
	@GetMapping("jpa/orgs/{username}")
	public List<Orgs> retrieve_orgs(@PathVariable String username){
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
}
