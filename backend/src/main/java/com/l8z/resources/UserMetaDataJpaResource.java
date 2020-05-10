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
		// Stores all the org_channels_istance_chat_time of the User
		String org_channel_instances_chat_time = "[]";
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
				org_channel_instances_chat_time = sql.get_org_channel_instances_chat_time();
				// Get the Current String
				contact_list = sql.get_contact_list();
				// Get the Current String
				fav_channel = sql.get_fav_channel();
			}

			// Add the new org_id
			org_ids.add(org_id);

			// Save it
			repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids), org_channels,
					org_channel_instances_chat_time, contact_list, fav_channel));
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
		// Stores all the org_channels_istance_chat_time of the User
		List<String> org_channel_instances_chat_time = new ArrayList<String>();
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
			// Convert to List of Strings Object
			org_channel_instances_chat_time = json_mapper.readValue(sql.get_org_channel_instances_chat_time(),
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

			for (int i = 0; i < org_channel_instances_chat_time.size(); i++) {
				// Checks if the starting is the org_id in question
				if (org_channel_instances_chat_time.get(i).startsWith(org_id + ".")) {
					// if so, delete it
					org_channel_instances_chat_time.remove(i);
				}

			}

			// Save it
			repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids),
					json_mapper.writeValueAsString(org_channels),
					json_mapper.writeValueAsString(org_channel_instances_chat_time), contact_list, fav_channel));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	public List<String> getUserChannels(String username){
	
		// Stores all the org_channels of the User
		List<String> org_channels = new ArrayList<String>();
	
		UserMetaData sql = null;
		
		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			if (sql != null) {				
				// Convert to List of Strings Object
				org_channels = json_mapper.readValue(sql.get_org_channels(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
			}

		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
		
		return org_channels;
	}
	
/////////////////////
//Channel Related //
/////////////////////		

	public void channel_added(String username, String org_id, String org_channel) {
		System.out.println("System - Adding Channel into User's Name");
		// Stores all the org_ids of the User
		List<String> org_ids = new ArrayList<String>();
		// Stores all the org_channels of the User
		List<String> org_channels = new ArrayList<String>();
		// Stores all the org_channels_istance_chat_time of the User
		String org_channel_instances_chat_time = "[]";
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
			// Get the Current String
			org_channel_instances_chat_time = sql.get_org_channel_instances_chat_time();
			// Get Current Contact List
			contact_list = sql.get_contact_list();
			// Get Favourite Channel
			fav_channel = sql.get_fav_channel();

			// Add the channel
			org_channels.add(new String(org_id + "." + org_channel));

			// Save it
			repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids),
					json_mapper.writeValueAsString(org_channels), org_channel_instances_chat_time, contact_list,
					fav_channel));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	public void favourite_channel_added(String username, String org_id, String favchannel) {
		System.out.println("System - Saving Favourite Channel");
		// Stores all the org_ids of the User
		List<String> org_ids = new ArrayList<String>();
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores all the org_channels_istance_chat_time of the User
		String org_channel_instances_chat_time = "[]";
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
				org_ids = json_mapper.readValue(sql.get_org_ids(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
				// Get the Current String
				org_channels = sql.get_org_channels();
				// Get the Current String
				org_channel_instances_chat_time = sql.get_org_channel_instances_chat_time();
				// Get the Current String
				contact_list = sql.get_contact_list();
				// Get Favourite Channel
				fav_channel = json_mapper.readValue(sql.get_fav_channel(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));

			}

			if (fav_channel.contains(org_id + "." + favchannel)) {
				fav_channel.remove(org_id + "." + favchannel);
			} else {
				// Add the new Fav_Channel
				fav_channel.add(new String(org_id + "." + favchannel));
			}

			// Save it
			repo.save(new UserMetaData(username, json_mapper.writeValueAsString(org_ids), org_channels,
					org_channel_instances_chat_time, contact_list, json_mapper.writeValueAsString(fav_channel)));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	@PostMapping(value = "jpa/orgs/favchannels/{username}/{org_id}/{fav_channel}")
	public ResponseEntity<Void> add_fav_channel(@PathVariable String username, @PathVariable String org_id,
			@PathVariable String fav_channel) {
		System.out.println("System - Creating Fav_Channel List");

		favourite_channel_added(username, org_id, fav_channel);

		return ResponseEntity.noContent().build();
	}

	@GetMapping("jpa/time/orgs/{username}/{org_id}/{channel_title}/{instance_title}")
	public String getChannelInstanceChatTime(@PathVariable String username, @PathVariable String org_id,
			@PathVariable String channel_title, @PathVariable String instance_title) {

		// Stores all the org_channels_istance_chat_time of the User
		List<String> org_channel_instances_chat_time = new ArrayList<String>();
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;
		String time = "";
		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			// Convert to List of Strings Object

			org_channel_instances_chat_time = json_mapper.readValue(sql.get_org_channel_instances_chat_time(),
					json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
			// Get Current Contact List

			for (int i = 0; i < org_channel_instances_chat_time.size(); i++) {
				// Checks if the starting is the org_id in question
				if (org_channel_instances_chat_time.get(i)
						.startsWith(org_id + "." + channel_title + "." + instance_title)) {
					String temp = org_channel_instances_chat_time.get(i);
					time = temp.substring(temp.indexOf('@') + 1, temp.length());
					break;
				}
			}

		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}

		return time;
	}

	@PostMapping("jpa/time/orgs/{username}/{org_id}/{channel_title}/{instance_title}")
	public ResponseEntity<Void> setChannelInstanceChatTime(@PathVariable String username, @PathVariable String org_id,
			@PathVariable String channel_title, @PathVariable String instance_title, @RequestBody String time) {

		System.out.println(time);
			
		
		String newTime = time.replace("\"", "");

		// Stores all the org_ids of the User
		String org_ids = "[]";
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores all the org_channels_istance_chat_time of the User
		List<String> org_channel_instances_chat_time = new ArrayList<String>();

		// Stores the users contact_list
		String contact_list = "[]";
		// Stores the favourite channel of the User
		String fav_channel = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;
		
		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);

			// Get the Current String
			org_ids = sql.get_org_ids();
			// Get the Current String
			org_channels = sql.get_org_channels();
			// Convert to List of Strings Object
			org_channel_instances_chat_time = json_mapper.readValue(sql.get_org_channel_instances_chat_time(),
					json_mapper.getTypeFactory().constructCollectionType(List.class, String.class)); // Get the Current
																										// String
			contact_list = sql.get_contact_list();
			// Get the Current String
			fav_channel = sql.get_fav_channel();

			for (int i = 0; i < org_channel_instances_chat_time.size(); i++) {
				if (org_channel_instances_chat_time.get(i)
						.startsWith(org_id + "." + channel_title + "." + instance_title)) {
					org_channel_instances_chat_time.remove(i);
				}
			}
			org_channel_instances_chat_time.add(org_id + "." + channel_title + "." + instance_title + "@" + newTime);
			
			// Save it
			repo.save(new UserMetaData(username, org_ids, org_channels,
					json_mapper.writeValueAsString(org_channel_instances_chat_time), contact_list, fav_channel));

		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}

		return ResponseEntity.noContent().build();
	}

/////////////////////
// Contact Related //
/////////////////////	

	public void contact_deleted(String username_1, String username_2) {
		System.out.println("System - Removing Contact");
		// Stores all the org_ids of the User
		String org_ids = "[]";
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores all the org_channels_istance_chat_time of the User
		String org_channel_instances_chat_time = "[]";
		// Stores the users contact_list
		List<String> contact_list = new ArrayList<String>();
		// Stores the favourite channel of the User
		String fav_channel = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username_1);
			// If its they haven't got any friends or joined any orgs, it will return null
			if (sql != null) {
				// Convert to List of Strings Object
				org_ids = sql.get_org_ids();
				// Get the Current String
				org_channels = sql.get_org_channels();
				// Get the Current String
				org_channel_instances_chat_time = sql.get_org_channel_instances_chat_time();
				// Get the Current String
				contact_list = json_mapper.readValue(sql.get_contact_list(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
				// Get Favourite Channel
				fav_channel = sql.get_fav_channel();

			}

			// Add the new contact
			if (contact_list.contains(username_2)) {
				contact_list.remove(username_2);
			}
			// Save it
			repo.save(new UserMetaData(username_1, org_ids, org_channels, org_channel_instances_chat_time,
					json_mapper.writeValueAsString(contact_list), fav_channel));
		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	@DeleteMapping(value = "jpa/private/contacts/{username_1}/{username_2}")
	public ResponseEntity<Void> remove_contact(@PathVariable String username_1, @PathVariable String username_2) {
		System.out.println("System - Removing Contact");

		contact_deleted(username_1, username_2);

		return ResponseEntity.noContent().build();
	}

	public void contact_added(String username1, String username2) {
		System.out.println("System - Saving Contact");
		// Stores all the org_ids of the User
		String org_ids = "[]";
		// Stores all the org_channels of the User
		String org_channels = "[]";
		// Stores all the org_channels_istance_chat_time of the User
		String org_channel_instances_chat_time = "[]";
		// Stores the users contact_list
		List<String> contact_list = new ArrayList<String>();
		// Stores the favourite channel of the User
		String fav_channel = "[]";
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;
		boolean isAlreadyContact = false;

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
				org_channel_instances_chat_time = sql.get_org_channel_instances_chat_time();
				// Get the Current String
				contact_list = json_mapper.readValue(sql.get_contact_list(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
				// Get Favourite Channel
				fav_channel = sql.get_fav_channel();

			}

			// Check if the User is Already a Contact
			for (int i = 0; i < contact_list.size(); i++) {
				if (contact_list.get(i).equals(username2)) {
					isAlreadyContact = true;
					break; // Speeding up Process
				}
			}
			// Confirm the User is Not A Contact and Not Yourself
			if (!isAlreadyContact && !username1.equals(username2)) {
				// Add the new contact
				contact_list.add(username2);
				// Save it
				repo.save(new UserMetaData(username1, org_ids, org_channels, org_channel_instances_chat_time,
						json_mapper.writeValueAsString(contact_list), fav_channel));
			}

		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}
	}

	@PostMapping(value = "jpa/private/contacts/{username_one}/{username_two}")
	public ResponseEntity<Void> create_contact(@PathVariable String username_one, @PathVariable String username_two) {
		System.out.println("System - Creating Contact List");

		contact_added(username_one, username_two);

		return ResponseEntity.noContent().build();
	}

	@GetMapping(value = "jpa/private/contacts/{username}/new")
	public List<String> get_contact_list(@PathVariable String username) {
		System.out.println("System - Retrieving Contact List");

		// Stores the users contact_list
		List<String> contact_list = new ArrayList<String>();
		// Used to Store Retrieved Data from Database
		UserMetaData sql = null;

		try {
			// Get the Current Data from Database if it Exists
			sql = repo.findByUsername(username);
			// If its they haven't got any friends or joined any orgs, it will return null
			if (sql != null) {
				contact_list = json_mapper.readValue(sql.get_contact_list(),
						json_mapper.getTypeFactory().constructCollectionType(List.class, String.class));
			}

		} catch (JsonMappingException e) {
			System.out.println("System - Error Updating Database");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Database");
		}

		return contact_list;
	}

}
