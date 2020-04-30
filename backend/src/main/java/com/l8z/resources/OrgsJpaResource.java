package com.l8z.resources;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
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
import com.l8z.jparepository.OrgsTodoJpaRepository;
import com.l8z.jparepository.PendingInvitesJpaRepository;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.orgs.Channels;
import com.l8z.orgs.Instances;
import com.l8z.orgs.Members;
import com.l8z.orgs.MembersStatus;
import com.l8z.orgs.Orgs;
import com.l8z.orgs.OrgsSQL;
import com.l8z.pending.PendingInvites;
import com.l8z.todos.OrgTodo;
import com.l8z.user.BasicUser;
import com.l8z.user.User;

@CrossOrigin(origins=GlobalVariable.L8Z_URL)
@RestController
public class OrgsJpaResource {
	///////////////////////////////////////////////////////////////////////////
	////////////////////////////// M E M B E R S //////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	@Autowired
	private OrgsJpaRepository orgsjpa;
	@Autowired
	private OrgsTodoJpaRepository orgstodojpa;
	@Autowired
	private UserJpaRepository userjpa;
	// Used for Saving Organisation ID to the User's Name
	@Autowired
	private UserMetaDataJpaResource user_meta_data_jpa_resouce = new UserMetaDataJpaResource();
	@Autowired
	private PendingInvitesJpaRepository pendingjpa;
	@Autowired
    private JavaMailSender mail;
	// Used to Read a JSON Document and Convert to Object
	private ObjectMapper json_mapper = new ObjectMapper();
	
	///////////////////////////////////////////////////////////////////////////
	///////////////// O R G A N I S A T I O N   R E L A T E D /////////////////
	///////////////////////////////////////////////////////////////////////////
	@GetMapping("jpa/orgs/{username}")
	public List<Orgs> retrieve_orgs(@PathVariable String username) {
		System.out.println("System - Retrieving Orgs");
		List<Orgs> users_orgs = new ArrayList<Orgs>();
		
		try {
    		// Convert to Sql Object
			List<OrgsSQL> temp_sql = orgsjpa.findAll(); 
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
		List<OrgsSQL> temp_sql = orgsjpa.findAll(); 
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
			OrgsSQL temp_sql = orgsjpa.getByOrgId(org_id); 
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			
			// Find the User
			for(int i=0; i<temp_org.get_members().size(); i++) {
				Members temp_member = temp_org.get_members().get(i);
				// This Comparison Only Checks for Username
				if(temp_member.equals(new Members(username, Members.Role.ORG_OWNER))){
					users_org = temp_org;
					break;
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
		OrgsSQL sql = null;
		try {
			sql = new OrgsSQL(org.get_org_id(), json_mapper.writeValueAsString(org), true);
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Creating Org");
		}
		
		// Save the Org to the Database
		orgsjpa.save(sql);
		// Add the Organsiation ID to the User's Name
		user_meta_data_jpa_resouce.user_joined_org(username, org.get_org_id());

		return ResponseEntity.noContent().build();
	}
	
	@PostMapping(value="/jpa/orgs/{username}/{org_id}")
	public ResponseEntity<Void> update_org(
			@PathVariable String username,
			@PathVariable String org_id, 
			@RequestBody Orgs org
		){
		
		// Save the Org
		OrgsSQL sql = null;
		// Ensure the Passed Value Wasn't Altered
		org.set_org_id(org_id);
		try {
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			sql = new OrgsSQL(org_id, json_mapper.writeValueAsString(org), recent_date_time);
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Org");
		}
		
		orgsjpa.save(sql);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("jpa/orgs/{username}/{org_id}")
	public ResponseEntity<Void> delete_org(@PathVariable String username, @PathVariable String org_id) {
		System.out.println("System - Delete Org");
		// First Get the Organisation
		OrgsSQL temp_sql = orgsjpa.getByOrgId(org_id);
		// Saves all the Members in the Case of it being Deleted
		List<Members> members = new ArrayList<Members>();
		
		// Check if the Requestor is the ORG_OWNER
		boolean org_owner = false;
		try {
    		// Convert to Orgs Object
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Saves the Members in an Array List
			members = temp_org.get_members();
			
			// Find the User
			for(int i=0; i<members.size(); i++) {
				// This Comparison Only Checks for Username
				if(members.get(i).equals(new Members(username, Members.Role.ORG_OWNER))){
					// Are they the ORG_OWNER?
					if(members.get(i).get_role() == Members.Role.ORG_OWNER) {
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
			// Remove the Organiation from Every User's List and OrgTodo Table
			for(int i=0; i<members.size(); i++) {
				// Remove the Organsiation ID from the User's Name
				user_meta_data_jpa_resouce.user_leaves_org(username, org_id);
			}
			// Remove the Organisation ID from the OrgTodo Table
			// Method
			
		}
		return ResponseEntity.noContent().build();
	}
	// Get all the Users Details in the Orgs
    @PostMapping("jpa/users/in/orgs")
    public List<MembersStatus> retrieve_basic_users_in_orgs(@RequestBody List<Members> users) {    	
    	// Send the Basic User information Back to Frontend
    	List<MembersStatus> members = new ArrayList<MembersStatus>();
    	
		// Get the @users Details
		for(int i=0; i<users.size(); i++) {
			Members m = users.get(i);
			User user = userjpa.findByUsername(m.get_username());
			if(user == null) continue; // Go Next
			// Add the User's Details
			members.add(new MembersStatus(user, m.get_role()));
		}
		
    	if(members.size() > 0) {
    		return members;
    	} else {
    		return null;
    	}
    }
    // Get all the Users Details in the Orgs
    @PostMapping("jpa/users/pending/{org_id}")
    public List<BasicUser> retrieve_pending_users_in_orgs(@PathVariable String org_id) {    	
    	// Send the Pending Basic User information to Frontend
    	List<BasicUser> invitees = new ArrayList<BasicUser>();
    	// Retrieve all the Pending Invites
    	List<PendingInvites> org_invites = pendingjpa.findByOrgId(org_id);
    	
		// Get the @users Details
		for(int i=0; i<org_invites.size(); i++) {
			User user = userjpa.findByUsername(org_invites.get(i).getInvitee());
			if(user == null) continue; // Go Next
			// Add the User's Details
			invitees.add(new BasicUser(user));
		}
		
    	if(invitees.size() > 0) {
    		return invitees;
    	} else {
    		return null;
    	}
    }
	@PostMapping("jpa/invite/orgs/{inviter}/{org_id}/{invitee}")
	public ResponseEntity<Void> invite_to_org(
			@PathVariable String inviter, 
			@PathVariable String org_id, 
			@PathVariable String invitee
		) {
		String unique = org_id+"."+invitee;
		pendingjpa.save(new PendingInvites(unique, inviter, invitee, org_id));
		/*
		// Create the Simple Mail Message and Set the Email, Subject and Message
	    SimpleMailMessage msg = new SimpleMailMessage();
	    User user = userjpa.findByUsername(invitee);
	    // Set the Email
        msg.setTo(user.getEmail());
        // Set the Subject
        msg.setSubject("L8Z - New Organisation Invite");
        // Set the Body Content
        msg.setText(
    		"Hello "+user.getFname()+" "+user.getLname()+",\n\n"
    		+ "Your L8Z account has received a new organisation invite! You currently have "
    		+  pendingjpa.findByInvitee(invitee).size()+ " pending invites.\n\n"
    		+ "Thank you for choosing L8Z,\n L8Z Team."
    	);
        
        // Send the Email
        mail.send(msg);
        */
		return ResponseEntity.noContent().build();
	}
	@GetMapping("jpa/user/invite/orgs/{unique_id}/{user_has_accepted}")
	public ResponseEntity<Void> user_decision_on_invite( 
			@PathVariable String unique_id,
			@PathVariable String user_has_accepted
		) {
		System.out.println("System - Pending Invite: "+unique_id+" is "+user_has_accepted);
		// if the User Accepted the Request
		if(user_has_accepted.equals("TRUE")) {
			// Gets the Current Invite
			PendingInvites pending = pendingjpa.findByUniqueId(unique_id);
			OrgsSQL temp_sql = null; 
			Orgs temp_org = null;
			String org_id = pending.getOrgId();
			try {
				// Convert the Sql Object
				temp_sql = orgsjpa.getByOrgId(org_id); 
				temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
				// Grabs Recent Date Time From Chat
				String recent_date_time = temp_sql.get_recent_date_time();
				
				// Add the New User to the Organisation
				temp_org.add_member(new Members(pending.getInvitee(), Members.Role.TEAM_MEMBER));
				
				// Save the Organisation
				orgsjpa.save(new OrgsSQL(org_id, json_mapper.writeValueAsString(temp_org), recent_date_time));
				// Adds to the User's Meta Data
				user_meta_data_jpa_resouce.user_joined_org(pending.getInvitee(), org_id);
			} catch (JsonMappingException e) {
				System.out.println("System - Error Retrieving Organisations");
			} catch (JsonProcessingException e) {
				System.out.println("System - Error Retrieving Organisations");
			}
		} 
		
		// if the User Accepted or Declined the Request
		pendingjpa.deleteByUniqueId(unique_id);
		
		return ResponseEntity.noContent().build();
	}
	@PostMapping("jpa/invite/removal/orgs/{remover}/{unique_id}")
	public ResponseEntity<Void> remove_invited_user_from_org(
			@PathVariable String remover, 
			@PathVariable String unique_id
		) {		
		pendingjpa.deleteByUniqueId(unique_id);
		
		return ResponseEntity.noContent().build();
	}
	@PostMapping("jpa/user/manage/orgs/{org_id}")
	public ResponseEntity<Void> manage_users_in_org(
			@PathVariable String org_id, 
			@RequestBody List<Members> body
		){
		// Ensure the 3 Elements Exist
		if(body.size() == 3) {
			// First Member is the Authenticator
			Members auth = body.get(0);
			// Second Member is the Managed Original User
			Members member = body.get(1);
			// Last Member contains  the Managed User Role
			Members.Role new_role = body.get(2).get_role();
			
			// Setting up SQL Transaction
			OrgsSQL temp_sql = null; 
			Orgs temp_org = null;
			try {
				// Convert the Sql Object
				temp_sql = orgsjpa.getByOrgId(org_id); 
				temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
				// Grabs Recent Date Time From Chat
				String recent_date_time = temp_sql.get_recent_date_time();
				
				// Manage the Member
				temp_org.manage_member(auth, member, new_role);
				
				// Save the Organisation
				orgsjpa.save(new OrgsSQL(org_id, json_mapper.writeValueAsString(temp_org), recent_date_time));
			} catch (JsonMappingException e) {
				System.out.println("System - Error Retrieving Organisations");
			} catch (JsonProcessingException e) {
				System.out.println("System - Error Retrieving Organisations");
			}
		}
		return ResponseEntity.noContent().build();
	}
	///////////////////////////////////////////////////////////////////////////
	////////////////////// C H A N N E L   R E L A T E D //////////////////////
	///////////////////////////////////////////////////////////////////////////
	@GetMapping("jpa/orgs/{username}/{org_id}/new")
	public List<String> retrieve_all_channel_titles(@PathVariable String username, @PathVariable String org_id) {
		System.out.println("System - Retrieving All Channels in the Org");

		List<Channels> channel_list = new ArrayList<Channels>();
		List<String> channel_title_namespace = new ArrayList<String>();
		
		try {
    		// Convert to Sql Object
			OrgsSQL temp_sql = orgsjpa.getByOrgId(org_id); 
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
		
		OrgsSQL sql = null;
		Orgs temp_org = null;
		try {
			// Convert to Sql Object
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			
			// Assign the ORG_OWNER to the Channel
			channel.set_owner(new Members(username, temp_org.retrieve_member(username).get_role()));
			System.out.println(username);
			System.out.println(temp_org.retrieve_member(username).get_role());
			// Add the Channel
			temp_org.add_channel(channel);
			
			sql = new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time);
			
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
		
		OrgsSQL sql = null;
		Orgs temp_org = null;

		try {
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			
			// Check if channel_title Changes
			if(!channel_title.equals(channel.get_channel_title())) {
				// Remove the Old Channel
				temp_org.remove_channel(temp_org.retrieve_channel(channel_title));
				// Add the New Channel
				temp_org.add_channel(channel);
			}
			
			// Convert to Sql Object
			sql = new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time);
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
		OrgsSQL sql = null;
		Orgs temp_org = null;
		
		OrgsSQL temp_sql = orgsjpa.getByOrgId(org_id);
		
		// Check if the Requestor is the ORG_OWNER And OWNER of Channel
		boolean org_owner = false;
		boolean channel_was_deleted = false;
		try {
    		// Convert to Orgs Object
			temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			
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
				channel_was_deleted = true;
			}
			
			// Convert to Sql Object
			sql = new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time);
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// Update the Organisation
		if(channel_was_deleted) {
			orgsjpa.save(sql);
		}
		return ResponseEntity.noContent().build();
	}
	@PostMapping("/jpa/members/{username}/orgs/{org_id}/{channel_title}/add")
	public ResponseEntity<Void> add_users_to_channel(
			@PathVariable String username, 
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@RequestBody List<Members> added_members
		) {
		OrgsSQL sql = null;
		Orgs temp_org = null;

		try {
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			// Get the Old Channel
			Channels temp_channel = temp_org.retrieve_channel(channel_title);
			// Remove the Old Channel
			temp_org.remove_channel(temp_channel);
			// Add the Users to the Channel
			for(int i=0; i<added_members.size(); i++) {
				temp_channel.add_member(added_members.get(i));	
			}
			// Add the Channel Back to the Org
			temp_org.add_channel(temp_channel);
			
			// Save the Org
			orgsjpa.save(new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time));
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Org");
		}
		
		return ResponseEntity.noContent().build();
	}
	@PostMapping("/jpa/members/{username}/orgs/{org_id}/{channel_title}/remove")
	public ResponseEntity<Void> remove_users_from_channel(
			@PathVariable String username, 
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@RequestBody List<Members> removed_members_from_channel
		) {
		OrgsSQL sql = null;
		Orgs temp_org = null;

		try {
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			// Get the Old Channel
			Channels temp_channel = temp_org.retrieve_channel(channel_title);
			// Remove the Old Channel
			temp_org.remove_channel(temp_channel);
			// Remove the Users from the Channel
			for(int i=0; i<removed_members_from_channel.size(); i++) {
				temp_channel.remove_member(removed_members_from_channel.get(i));	
			}
			// Add the Channel Back to the Org
			temp_org.add_channel(temp_channel);
			
			// Save the Org
			orgsjpa.save(new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time));
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Updating Org");
		}
		
		return ResponseEntity.noContent().build();
	}
	///////////////////////////////////////////////////////////////////////////
	///////////////// C H A N N E L   T O D O   R E L A T E D /////////////////
	///////////////////////////////////////////////////////////////////////////
	@GetMapping("/jpa/orgs/todos/{username}/{org_id}/{channel_title}")
	public List<OrgTodo> retrieve_org_todos(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title
		){
		System.out.println("System - Retrieving Organisation Todos");
		return orgstodojpa.getByOrgChannel(org_id+"."+channel_title);
	}
	
	@GetMapping("/jpa/orgs/todos/{username}/{org_id}/{channel_title}/{id}")
	public OrgTodo retrieve_org_todo(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@PathVariable long id){
		return orgstodojpa.findById(id).get();
	}
	
	@PostMapping("/jpa/orgs/todos/{username}/{org_id}/{channel_title}/new")
	public ResponseEntity<Void> create_org_todo(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title, 
			@RequestBody OrgTodo todo
		){
		// Sets the 2 Identifiers
		todo.setOrgId(org_id);
		todo.setOrgChannel(org_id+"."+channel_title);
		// Saves to Database
		orgstodojpa.save(todo);
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/jpa/orgs/todos/{username}/{org_id}/{channel_title}/{id}")
	public ResponseEntity<Void> update_org_todo(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@PathVariable long id, 
			@RequestBody OrgTodo todo
		){
		OrgTodo todoToUpdate = orgstodojpa.getOne(id);
		todoToUpdate.set_date(todo.get_date());
		todoToUpdate.set_desc(todo.get_desc());

		orgstodojpa.save(todoToUpdate);
		return ResponseEntity.noContent().build();
	}
	
	@PostMapping("/jpa/orgs/todos/{username}/{org_id}/{channel_title}/{id}/status")
	public ResponseEntity<Void> update_org_todo_status(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@PathVariable long id
		) {
		OrgTodo todoToUpdate = orgstodojpa.getOne(id);
		todoToUpdate.set_status(!todoToUpdate.get_status());
		orgstodojpa.save(todoToUpdate);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/jpa/orgs/todos/{username}/{org_id}/{channel_title}/{id}")
	public ResponseEntity<Void> delete_org_todo(
			@PathVariable String username,
			@PathVariable String org_id,
			@PathVariable String channel_title,
			@PathVariable long id
		) {
		orgstodojpa.deleteById(id);
		return ResponseEntity.noContent().build();
	}
	///////////////////////////////////////////////////////////////////////////
	///////////////////// I N S T A N C E   R E L A T E D /////////////////////
	///////////////////////////////////////////////////////////////////////////
	@GetMapping("jpa/orgs/{username}/{org_id}/{channel_title}/new")
	public List<String> retrieve_all_instance_titles(@PathVariable String username, @PathVariable String org_id,  @PathVariable String channel_title) {
		System.out.println("System - Retrieving All Instances in the Org");

		List<Instances> instance_list = new ArrayList<Instances>();
		List<String> instance_title_namespace = new ArrayList<String>();
		
		try {
    		// Convert to Sql Object
			OrgsSQL temp_sql = orgsjpa.getByOrgId(org_id); 
			Orgs temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Get the Instance List
			instance_list = temp_org.retrieve_channel(channel_title).get_instances();
			
			// Get the Namespace
			for(int i=0; i<instance_list.size(); i++) {
				instance_title_namespace.add(instance_list.get(i).get_instance_title());
			}
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
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
		
		OrgsSQL sql = null;
		Orgs temp_org = null;
		try {
			// Convert to Sql Object
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
						
			// Add the Instance
			temp_org.add_instance(channel_title, instance);
			
			sql = new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time);
			
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
		
		OrgsSQL sql = null;
		Orgs temp_org = null;

		try {
			sql = orgsjpa.getByOrgId(org_id); 
			temp_org = json_mapper.readValue(sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
			
			// Remove the Old Instance
			temp_org.remove_instance(channel_title, instance_title);
			// Add the New Instance
			temp_org.add_instance(channel_title, instance);
			
			// Convert to Sql Object
			sql = new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time);
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
		OrgsSQL sql = null;
		Orgs temp_org = null;
		
		OrgsSQL temp_sql = orgsjpa.getByOrgId(org_id);
		
		// Check if the Requestor is the ORG_OWNER And OWNER of Channel
		boolean org_owner = false;
		boolean instance_was_deleted = false;
		try {
    		// Convert to Orgs Object
			temp_org = json_mapper.readValue(temp_sql.get_data(), Orgs.class);
			// Grabs Recent Date Time From Chat
			String recent_date_time = orgsjpa.getByOrgId(org_id).get_recent_date_time();
						
			// Check if the User is the ORG_OWNER
			if(temp_org.retrieve_member(username).get_role() == Members.Role.ORG_OWNER) {
				org_owner = true;
			}
			// Just Making Lines Smaller
			Members channel_owner = temp_org.retrieve_channel(channel_title).get_owner();
			Members temp_member = new Members(username, Members.Role.ORG_OWNER);
			
			// If the Channel Owner is Equal to the Temp Member or ORG_OWNER
			if(channel_owner.equals(temp_member) || org_owner) {
				// Remove the Instance
				temp_org.remove_instance(channel_title, instance_title);
				instance_was_deleted = true;
			}
			
			// Convert to Sql Object
			sql = new OrgsSQL(temp_org.get_org_id(), json_mapper.writeValueAsString(temp_org), recent_date_time);
		} catch (JsonMappingException e) {
			System.out.println("System - Error Retrieving Organisations");
		} catch (JsonProcessingException e) {
			System.out.println("System - Error Retrieving Organisations");
		}
		
		// Update the Organisation
		if(instance_was_deleted) {
			orgsjpa.save(sql);
		}
		return ResponseEntity.noContent().build();
	}
	
}
