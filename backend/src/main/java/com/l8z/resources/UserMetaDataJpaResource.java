package com.l8z.resources;

import java.util.ArrayList;
import java.util.List;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.l8z.GlobalVariable;
import com.l8z.chat.ChatMessage;
import com.l8z.contacts.Contact;
import com.l8z.jparepository.UserMetaDataJpaRepository;
import com.l8z.orgs.Channels;
import com.l8z.orgs.Members;
import com.l8z.orgs.Orgs;
import com.l8z.orgs.OrgsSQL;
import com.l8z.user.BasicUser;
import com.l8z.user.UserMetaData;

@CrossOrigin(origins = GlobalVariable.L8Z_URL)
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
		// Stores the favourite channel of the User
		String fav_channel = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			// If they haven't got any friends or joined any orgs, it will return null
			if (sql != null) {
				// Convert to List of Strings Object
				org_ids = json_mapper.readValue(sql.get_org_ids(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
				// Get the Current String
				org_channels = sql.get_org_channels();
				// Get the Current String
				contact_list = sql.get_contact_list();
				// Get the Current String
				fav_channel = sql.get_fav_channel();
			}

			// Add the new org_id
			org_ids.add(org_id);

			// Save it
			repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids), org_channels, contact_list, fav_channel));
		} catch (JsonMappingException e) {
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
		// Stores the favourite channel of the User
		String fav_channel = "[]";
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
			// Get Favourite Channel
			fav_channel = sql.get_fav_channel();

			// Remove the org_id
			org_ids.remove(org_id);
			// Remove the org_id and it's Channels
			for (int i = 0; i < org_channels.size(); i++) {
				// Checks if the starting is the org_id in question
				if (org_channels.get(i).startsWith(org_id + ".")) {
					// if so, delete it
					org_channels.remove(i);
				}
			}

			// Save it
			repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids),
					json_mapper.writeValueAsString(org_channels), contact_list, fav_channel));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	public void contact_added(String username1, String username2) {
		System.out.println("System - Saving Contact");
		// Stores all the org_ids of the User
		String org_ids = "[]";
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores the users contact_list
		List<String> contact_list = new ArrayList<String>();
		// Stores the favourite channel of the User
		String fav_channel = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username1);
			// If its they haven't got any friends or joined any orgs, it will return null
			if (sql != null) {
				// Convert to List of Strings Object
				org_ids = sql.get_org_ids();
				// Get the Current String
				org_channels = sql.get_org_channels();
				// Get the Current String
				contact_list = json_mapper.readValue(sql.get_contact_list(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, Contact.class));
				// Get Favourite Channel
				fav_channel = sql.get_fav_channel();

			}

			// Add the new contact
			contact_list.add(new String(username2));

			// Save it
			repo.save(new UserMetaData(username1, org_ids, org_channels, json_mapper.writeValueAsString(contact_list), fav_channel));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}
	
	
	public void favourite_channel_added(String username, String favchannel) {
		System.out.println("System - Saving Favourite Channel");
		// Stores all the org_ids of the User
		String org_ids = "[]";
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores the users contact_list
		String contact_list = "[]";
		// Stores the favourite channel of the User
		List<String> fav_channel = new ArrayList<String>();
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			// If its they haven't got any friends or joined any orgs, it will return null
			if (sql != null) {
				// Convert to List of Strings Object
				org_ids = sql.get_org_ids();
				// Get the Current String
				org_channels = sql.get_org_channels();
				// Get the Current String
				contact_list = sql.get_contact_list();
				// Get Favourite Channel
				fav_channel = json_mapper.readValue(sql.get_fav_channel(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, Contact.class));

			}

			// Add the new contact
			fav_channel.add(new String(favchannel));

			// Save it
			repo.save(new UserMetaData(username, org_ids, org_channels, contact_list, json_mapper.writeValueAsString(fav_channel)));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	@PostMapping(value = "jpa/private/contacts/{username_one}/{username_two}")
	public ResponseEntity<Void> create_contact(@PathVariable String username_one, @PathVariable String username_two) {
		System.out.println("System - Creating Contact List");
	
		contact_added(username_one,username_two);

		return ResponseEntity.noContent().build();
	}
	
	@PostMapping(value = "jpa/orgs/favchannels/{username}/{fav_channel}")
	public ResponseEntity<Void> add_fav_channel(@PathVariable String username, @PathVariable String fav_channel) {
		System.out.println("System - Creating Contact List");
	
		favourite_channel_added(username,fav_channel);

		return ResponseEntity.noContent().build();
	}

}
