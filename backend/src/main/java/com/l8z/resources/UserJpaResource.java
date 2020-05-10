package com.l8z.resources;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.l8z.GlobalVariable;
import com.l8z.jparepository.PasswordRecoveryJpaRepository;
import com.l8z.jparepository.PendingInvitesJpaRepository;
import com.l8z.jparepository.UserJpaRepository;
import com.l8z.jwt.JwtPasswordDecryption;
import com.l8z.pending.PendingInvites;
import com.l8z.user.BasicUser;
import com.l8z.user.PasswordResetToken;
import com.l8z.user.User;

@CrossOrigin(origins = GlobalVariable.L8Z_URL)
@RestController
public class UserJpaResource {
	private static final int DATE_LEN = 12;
	private static final int ABB_LEN = 15;
	private static final int TIME_LEN = 16;

	@Autowired
	private UserJpaRepository repo;
	@Autowired
	private PasswordRecoveryJpaRepository prrepo;
	@Autowired
	private PendingInvitesJpaRepository pendingjpa;
	@Autowired
	private PasswordEncoder bCryptEncoder;
	@Autowired
	private JavaMailSender mail;

	@GetMapping("/jpa/profile/{username}")
	public User receiveUserProfile(@PathVariable String username) {
		return repo.findByUsername(username);
	}

	@PostMapping("/jpa/profile/{username}")
	public ResponseEntity<Void> updateUserProfile(@PathVariable String username, @RequestBody User profile) {
		User userUpdate = repo.getOne(profile.getID());
		// Future Updates Possibly?
		// userUpdate.setUsername(profile.getUsername());
		// userUpdate.setPassword(profile.getPassword());
		// userUpdate.setEmail(profile.getEmail());

		userUpdate.setFname(profile.getFname());
		userUpdate.setLname(profile.getLname());
		userUpdate.setFname(profile.getFname());
		userUpdate.setAddress(profile.getAddress());
		userUpdate.setBio(profile.getBio());
		userUpdate.setImagePath(profile.getImagePath());

		// userUpdate.displayUser();
		// Update Profile
		repo.save(userUpdate);
		return ResponseEntity.noContent().build();
	}

	@PostMapping("/jpa/user/password/reset/{email}")
	public boolean sendTokenForResetPassword(@PathVariable("email") String email) {
		// Ensure the User Exists
		User user = repo.findUserByEmail(email);
		if (user == null) {
			System.out.println("System - Email Specified Is Not Associated to an Account!");
			return false;
		} else {
			// Create the Token for the User to Reset their Password
			String token = UUID.randomUUID().toString();
			// Check if the User Already has a Token
			PasswordResetToken check = prrepo.findByUsername(user.getUsername());
			// if a Password Reset Token was already created, Deleted it and make a New One
			if (check != null) {
				prrepo.deleteById(check.getId());
			}
			// Save the Token to the Database
			prrepo.save(new PasswordResetToken(token, user.getUsername()));
			// Create the Simple Mail Message and Set the Email, Subject and Message
			SimpleMailMessage msg = new SimpleMailMessage();
			// Set the Email
			msg.setTo(email);
			// Set the Subject
			msg.setSubject("L8Z - Password Reset for " + user.getUsername());
			String url = GlobalVariable.L8Z_URL + "/recover/password/" + token;
			// Set the Body Content
			msg.setText("Hello " + user.getFname() + " " + user.getLname() + ",\n\n"
					+ "Your L8Z account has requested a recovery of password. If this was not you, please ignore this email.\n"
					+ url + "\n\n" + "Thank you for choosing L8Z,\n L8Z Team.");

			// Send the Email
			mail.send(msg);

			cleanupPasswordResetToken();
			return true;
		}
	}

	@PostMapping("/jpa/check/password/reset/token/{token}")
	public PasswordResetToken checkPasswordResetToken(@PathVariable String token) {
		boolean isValidToken = false;
		PasswordResetToken check = prrepo.findByToken(token);
		// if PasswordResetToken is null, it'll be returned as null
		if (check != null) {
			// Comparing the the Current Time Date and Token Time Date
			String cTD = (new SimpleDateFormat("h:mm a (dd/MM/yyyy)").format(new Date())).toUpperCase();
			isValidToken = checkTimeAbbDate(cTD, check.getExpiryDate());

			// if the Token is Not Valid, Delete it and Return null
			if (!isValidToken) {
				prrepo.deleteById(check.getId());
			}
		}

		// if it was Deleted above, return null
		if (!isValidToken) {
			return null;
		} else {
			return check;
		}
	}

	@PostMapping("/jpa/profile/{username}/{password}/{id}")
	public boolean updateUserPassword(@PathVariable String username, @PathVariable String password,
			@PathVariable Long id) {
		User user = repo.findByUsername(username);
		if (user != null) {
			// if a Token was present, immediately update password
			if (id != -1) {
				// Remove the Token from the Database
				prrepo.deleteById(id);
			}

			// Overwrite the Current Password in the System
			user.setPassword(bCryptEncoder.encode(JwtPasswordDecryption.decrypt(password, "L8Z")));

			// Save User
			repo.save(user);
			return true;
		} else {
			return false;
		}
	}

	@GetMapping("/jpa/retrieve/user/{name}")
	public List<BasicUser> retrieve_all_basic_users_by_name(@PathVariable String name) {
		return repo.searchByName(name.toLowerCase());
	}

	@GetMapping("/jpa/retrieve/all/user/names")
	public List<String> retrieve_all_name_space() {
		return repo.retrieveAllNames();
	}

	// Get all the Users' Pending Invites
	@GetMapping("jpa/user/{username}/pending/invites")
	public List<PendingInvites> retrieve_pending_invites_for_user(@PathVariable String username) {
		// Retrieve all the Pending Invites
		return pendingjpa.findByInvitee(username);
	}

	@PostMapping("jpa/basic/users")
	public List<BasicUser> retrieve_basic_user(@RequestBody String[] usernames) {
		List<BasicUser> inviter_basic_users = new ArrayList<BasicUser>();
		for (int i = 0; i < usernames.length; i++) {
			inviter_basic_users.add(repo.getByUsername(usernames[i]));
		}
		return inviter_basic_users;
	}

	// Helper Method: Uses the Current/Token Time Dates to Determine Expiration of
	// Token
	public boolean checkTimeAbbDate(String cTD, String tTD) {
		boolean isVaildToken = false;
		// Compare the Dates of the Current Time vs Token Set Time
		String cDate = cTD.substring(cTD.length() - DATE_LEN, cTD.length());
		String tDate = tTD.substring(tTD.length() - DATE_LEN, tTD.length());
		// Compare the Abbreivation (AM/PM)
		String cAbb = cTD.substring(cTD.length() - ABB_LEN, cTD.length() - DATE_LEN - 1);
		String tAbb = tTD.substring(tTD.length() - ABB_LEN, tTD.length() - DATE_LEN - 1);
		// Compare the Times (0: Hour, 1: Minutes)
		String[] cTime = (cTD.substring(0, cTD.length() - TIME_LEN)).split(":");
		String[] tTime = (tTD.substring(0, tTD.length() - TIME_LEN)).split(":");
		int cHour = Integer.parseInt(cTime[0]);
		int tHour = Integer.parseInt(tTime[0]);
		int cMinutes = Integer.parseInt(cTime[1]);
		int tMinutes = Integer.parseInt(tTime[1]);
		// Comparison of Hours and Minutes
		int compHours = tHour - cHour;
		int compMinutes = cMinutes - tMinutes;

		// if they are the Same Date, Check Abbreivation (AM/PM)
		if (cDate.compareTo(tDate) == 0) {
			// If they are the Same Abbreviation, Check the Time
			if (cAbb.compareTo(tAbb) == 0) {

				// Check if the Hours are the Same
				if (compHours == 0) {
					isVaildToken = (compMinutes >= -10 && compMinutes <= 0) ? true : false;
				}
				// Boundary Condition for 1 Hour Difference (xx:59)
				else {
					isVaildToken = (compMinutes >= 50 && compMinutes <= 59) ? true : false;
				}

			}
			// Boundary Condition for Mid Day (AM -> PM)
			else {
				// 12 (PM) - 11 (AM)
				if (compHours == 1) {
					isVaildToken = (compMinutes >= 50 && compMinutes <= 59) ? true : false;
				}
			}
		}
		// Boundary Condition for Midnight
		else if (cDate.compareTo(tDate) == -1) {
			// 12 (AM) - 11 (PM)
			if (compHours == 1) {
				isVaildToken = (compMinutes >= 50 && compMinutes <= 59) ? true : false;
			}
		} else {
			// The Current or Time Expiry Date is Invalid
			isVaildToken = false;
		}
		return isVaildToken;
	}

	// Helper Method: Cleans up the PasswordResetToken Table
	public void cleanupPasswordResetToken() {
		// Clean-Up PasswordResetTable
		List<PasswordResetToken> allRecords = prrepo.findAll();
		boolean isValidToken;
		for (int i = 0; i < allRecords.size(); i++) {
			// Comparing the the Current Time Date and Token Time Date
			String cTD = (new SimpleDateFormat("h:mm a (dd/MM/yyyy)").format(new Date())).toUpperCase();
			isValidToken = checkTimeAbbDate(cTD, allRecords.get(i).getExpiryDate());

			// if the Token is Not Valid, Delete it
			if (!isValidToken) {
				prrepo.deleteById(allRecords.get(i).getId());
			}
		}
	}
}