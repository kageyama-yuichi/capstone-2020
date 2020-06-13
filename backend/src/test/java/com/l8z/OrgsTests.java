package com.l8z;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;
import static org.junit.jupiter.api.Assertions.fail;
import static org.hamcrest.collection.IsCollectionWithSize.hasSize;
import static org.hamcrest.collection.IsIterableContainingInOrder.contains;

import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.l8z.orgs.Channels;
import com.l8z.orgs.Instances;
import com.l8z.orgs.Members;
import com.l8z.orgs.Orgs;

class OrgsTests {
	// Creating Members
	Members michael = new Members("Michael", Members.Role.ORG_OWNER);
	Members v = new Members("Hung", Members.Role.ADMIN);
	Members raimond = new Members("Raimond", Members.Role.TEAM_MEMBER);
	Members matthew = new Members("Matthew", Members.Role.TEAM_MEMBER);
	Members tyler = new Members("Tyler", Members.Role.TEAM_LEADER);
	Members yuichi = new Members("Yuichi", Members.Role.ADMIN);
	
	// Creating Instances for the Two Channels
	Instances instanceOne = new Instances("Computing Theory", Instances.InstanceType.CHAT);
	Instances instanceTwo = new Instances("Algorithms and Analysis", Instances.InstanceType.CHAT);
	Instances instanceThree = new Instances("Cloud Computing", Instances.InstanceType.VOICE);
	
	// Creating Channels with V as the Channel Owner of Comp Sci
	Channels channelOne = new Channels("Comp Sci", v);
	Channels channelTwo = new Channels("IT", tyler);
	
	// Create the Organisation
	Orgs orgs = new Orgs();
	
	
	@BeforeEach
	void setup() {
		
		
		// Set the Organisation Parameters
		orgs.set_org_id("rmit");
		orgs.set_org_title("RMIT Programming Project 1");
		
		
		// Adding Users to the Orgs Member List
		orgs.add_member(michael);
		orgs.add_member(v);
		orgs.add_member(raimond);
		orgs.add_member(matthew);
		orgs.add_member(tyler);
		orgs.add_member(yuichi);
		
		// Add the Channels to the Organisation
		orgs.add_channel(channelOne);
		orgs.add_channel(channelTwo);
		
		// Add Users to the Channels Member List
		channelOne.add_member(michael);
		channelOne.add_member(v);
		channelOne.add_member(matthew);
		channelOne.add_member(raimond);
		channelOne.add_member(yuichi);
		
		// Add Users to the Channels Member List
		channelTwo.add_member(tyler);
		
		// Adding the Instances to the Channels
		channelOne.add_instance(instanceOne);
		channelOne.add_instance(instanceTwo);
		
		// Adding the Instance to the Channel
		channelTwo.add_instance(instanceThree);
		
		
	}
	@Test
	void testOrgs() {
		
		//Testing Getters
		assertEquals(orgs.get_org_id(),"rmit");
		assertEquals(orgs.get_org_title(),"RMIT Programming Project 1");
		
		//Testing that there are 6 members in the org
		assertThat(orgs.get_members(), hasSize(6));
		
		//Testing that it finds the members in the org
		assertEquals(orgs.has_member(michael), true);
		assertEquals(orgs.has_member(v), true);
		assertEquals(orgs.has_member(raimond), true);
		assertEquals(orgs.has_member(matthew), true);
		assertEquals(orgs.has_member(yuichi), true);
		assertEquals(orgs.has_member(tyler), true);
		
	}
	
	@Test
	void removeChannelTest() {
		
		//There should be currently two channels in orgs
		assertThat(orgs.get_channels(), hasSize(2));
		
		//Removing channelTwo should make it so there is only one channel in orgs
		orgs.remove_channel(channelTwo);
		assertThat(orgs.get_channels(), hasSize(1));
		
	}
	
	@Test
	void testRemoveInstances() {
		
		//Inital test to check that channelOne has a title of Comp Sci and has two instances
		assertEquals(channelOne.get_channel_title(),"Comp Sci");
		assertThat(channelOne.get_instances(), hasSize(2));
		
		//Removing Computing Theory instance from Comp Sci instance
		//Test should reveal there is only one instance in channelOne
		orgs.remove_instance("Comp Sci", "Computing Theory");
		assertThat(channelOne.get_instances(), hasSize(1));
	}
	
	@Test
	void manageMemberTest() {
		
		//Changing tylers role to admin test
		orgs.manage_member(michael, tyler, Members.Role.ADMIN);
		assertEquals(orgs.retrieve_member(tyler.get_username()).get_role(), Members.Role.ADMIN);
	}
	
	@Test
	void ChannelsTest() {
		
		//Checking owner of channelOne to be v
		assertEquals(channelOne.get_owner().get_username(), v.get_username());
		
		//Checking that channelOne has 5 members
		assertThat(channelOne.get_members(), hasSize(5));
		
		//Checking that channelOne has a member named Michael
		assertEquals(channelOne.has_member(michael), true);
		
	}
	
	@Test
	void RemoveMemberTestChannel() {
		
		//Removing Michael from channelOne
		channelOne.remove_member(michael);
		assertEquals(channelOne.has_member(michael), false);
		
	}
	
	@Test
	void ManageMembersChannels() {
		
		//Making Michael ADMIN
		channelOne.manage_member(michael, Members.Role.ADMIN);
		assertEquals(channelOne.retrieve_member(michael.get_username()).get_role(), Members.Role.ADMIN);
		
	}
	
	@Test
	void InstanceTest() {
		
		//Checking that instranceOne is a CHAT type
		assertEquals(instanceOne.get_type(), Instances.InstanceType.CHAT);
	}
	
}



