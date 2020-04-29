import React, {Component} from "react";
import OrgsResources from "./OrgsResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";
	import AddUserToChannelComponent from "./Channels/AddUserToChannelComponent.jsx";
import "./UpdateOrgsComponent.css";

import {Container, Form, Button, ButtonGroup, Row, Col, ListGroup} from "react-bootstrap";

/*
	Left to do:
	Work out how to Delete Members
	Work out how to Delete Channels
	Work out how to Invite Members Here
	Work out how to Update a Member Role
	Fix all the this.on_submit() validation
*/
var channels = [];
var current_members_in_channel = [];
var current_namespace = [];
var searched_users = [];
var pending_users = [];
const org_member_details = new Map();

class UpdateOrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			old_org_id: this.props.match.params.org_id,
			org_title: "",
			search_key: "",
			members: [],
			org: [],
			owned_ids: [],
			memberListOpen: [],
			errors: [],
			member_details_loaded: false,
			invite_sent: false,
			show_add_users: false,
			temp_channel_title: "",
		};
		this.on_submit = this.on_submit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.invite_user = this.invite_user.bind(this);
		this.add_users_to_channel = this.add_users_to_channel.bind(this);
	}

	handleValidation(e) {
		
		var formIsValid = true;
		var str2 = this.state.org_id;
		var errors = {};
		if (this.state.org_id.length < 3 || this.state.org_id === "new") {
			errors.id = "Org ID is too short";
			formIsValid = false;
		} else {
			// Check if the ID Exists
			for (let i = 0; i < this.state.owned_ids.length; i++) {
				var str1 = this.state.owned_ids[i].org_id;
				// Compare the String Values
				if (str1.valueOf() === str2.valueOf()) {
					formIsValid = false;
					errors.id = "Org ID already used";
					break;
				}
			}
		}
		// Ensure Length is 3 or Greater
		if (this.state.org_title.length < 3) {
			errors.title = "Org Title is too short";
			formIsValid = false;
		}

		// if (formIsValid) {
		// 	// Check if the ID Exists
		// 	for (let i = 0; i < this.state.owned_ids.length; i++) {
		// 		var str1 = new String(this.state.owned_ids[i].org_id);
		// 		// Compare the String Values
		// 		if (str1.valueOf() == str2.valueOf()) {
		// 			formIsValid = false;
		// 		}
		// 	}

		// 	if (!formIsValid) {
		// 		errors.id = "Org ID already used";
		// 		console.log("System - ID Already Used");
		// 	}
		// }

		let form = e.currentTarget;
		var formControl = Array.prototype.slice.call(form.querySelectorAll(".form-control"));

		//Iterate over input fields and get corresponding error
		//Flag form as invalid if there is an error
		console.log(form);
		formControl.forEach((ele) => {
			if (errors[ele.name]) {
				ele.setCustomValidity("invalid");
			} else {
				ele.setCustomValidity("");
				
			}
		});

		this.setState({errors: errors});
		console.log(errors);
		return formIsValid;
	}

	on_submit = (e) => {
		e.preventDefault();

		if (this.handleValidation(e)) {
			console.log("System - Creating New Organisation");
			let org_push = {
				org_id: this.state.org_id,
				org_title: this.state.org_title,
				channels: channels,
				members: this.state.members,
			};
			console.log(org_push);
			OrgsResources.update_org(
				this.state.username,
				this.state.old_org_id,
				org_push
			).then(() => this.props.history.goBack());
		}

		this.setState({validated: true});
	};
	handle_typing_org_title = (event) => {
		this.setState({
			org_title: event.target.value,
			error: false,
		});
	};
	handle_typing_search_key = (event) => {
		this.setState({
			search_key: event.target.value.replace(/[^a-zA-Z ']/gi, ""),
		});
	};
	
	handle_create_channel = () => {
		var url = this.props.history.location.pathname + "/new";
		this.props.history.push(url);
	};
	handle_delete_channel = (channel_title) => {
		console.log("Deleteing");
		OrgsResources.delete_channel(this.state.username, this.state.org_id, channel_title).then((response) => {
			console.log("Deleted");
			// Reset the Channels Variable
			channels = []; 
			// Retrieves All Channels from the Org Data
			OrgsResources.retrieve_org(this.state.username, this.state.old_org_id).then((response) => {
				channels = response.data.channels;
			});
		});
	};
	handle_update_channel = (channel_title) => {
		var url = this.props.history.location.pathname + "/" + channel_title;
		this.props.history.push(url);
	};

	handleCancel() {
		this.props.history.goBack();
	}

	componentDidUpdate() {
		// Update the Pending Users List
		if(this.state.invite_sent === true){
			OrgsResources.retrieve_pending_users_in_orgs(this.state.org_id).then((response) => {
				// if there is no Data, Don't Sort
				if(response.data != ""){
					pending_users = response.data.sort(this.sort_by_alphabetical_order_pending);
				} else {
					pending_users = response.data;
				}
				this.setState({
					invite_sent: false,
				})
			});
		}
		// console.log(this.state.org_id);
		// console.log(this.state.org_title);
		// console.log(this.state.channels);
		// console.log(this.state.members);
	}

	componentDidMount() {
		OrgsResources.retrieve_pending_users_in_orgs(this.state.org_id).then((response) => {
			// if there is no Data, Don't Sort
			if(response.data != ""){
				pending_users = response.data.sort(this.sort_by_alphabetical_order_pending);
			} else {
				pending_users = response.data;
			}
		});
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				// They Can Claim the Same ID
				if (this.state.org_id !== response.data[i]) {
					this.state.owned_ids.push({
						org_id: response.data[i],
					});
					this.setState({
						owned_ids: this.state.owned_ids,
					});
				}
			}
		});
		// Retrieves All the Current Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.old_org_id).then((response) => {
			channels = response.data.channels;
			this.setState({
					org_id: response.data.org_id,
					org_title: response.data.org_title,
					members: response.data.members,
				},
				() => {
					//Initializing member list dropdown
					channels.map((channel) => {
						this.state.memberListOpen[channel.channel_title] = false;
					});

					this.setState({memberListOpen: this.state.memberListOpen});
				}
			);
		}).then(
			() => {
				this.load_org_member_details();
			}
		);
		OrgsResources.retrieve_all_name_space().then((response) => {
			current_namespace = response.data.sort();
		});
	}

	handle_search_new_users = () => {
		if(this.state.search_key != ""){
			// Search for the Users Specified and Update Area
			OrgsResources.retrieve_all_basic_users_by_name(this.state.search_key).then((response) => {
				// Assign the Searched Users that Are Not in the Org to the Array
				searched_users = [];
				// Create a Temporary Map for the Pending Users
				const temp_map = new Map();
				for(let i=0; i<pending_users.length; i++){
					temp_map.set(pending_users[i].username, pending_users[i]);
				}
				var temp = response.data.sort(this.sort_by_alphabetical_order_pending);
				for(let i=0; i<temp.length; i++){
					if(!org_member_details.has(temp[i].username) && !temp_map.has(temp[i].username)){
						searched_users.push(temp[i]);
					}
				}
				// Re-render the Page to Display Array
				this.setState({
					search_key: ""
				});
			});
		} else {
			// Do Nothing
		}
	};
	
	toggleMemberListDisplay(channel_title) {
		this.state.memberListOpen[channel_title] = !this.state.memberListOpen[channel_title];
		this.forceUpdate();
	}

	setRoleStyling = (role) => {
		var ret = "light";

		if (role === "ORG_OWNER") {
			ret = "danger";
		} else if (role === "ADMIN") {
			ret = "warning";
		} else if (role === "TEAM_LEADER") {
			ret = "info";
		}

		return ret;
	};
	
	sort_by_role = () => {
		let org_owner;
		let admins = [];
		let team_leaders = [];
		let team_members = [];
		
		let temp = this.state.members;
		for(let i=0; i<temp.length; i++){
			if(temp[i].role === "ORG_OWNER") {
				org_owner = temp[i];
			} else if(temp[i].role === "ADMIN") {
				admins.push(temp[i]);
			} else if(temp[i].role === "TEAM_LEADER") {
				team_leaders.push(temp[i]);
			} else {
				team_members.push(temp[i]);
			}
		}
		
		// Sort the Arrays by Alphabetical Order
		admins = admins.sort(this.sort_by_alphabetical_order);
		team_leaders = team_leaders.sort(this.sort_by_alphabetical_order);
		team_members = team_members.sort(this.sort_by_alphabetical_order);
		
		// Create the New this.state.members
		let new_members = [];
		new_members.push(org_owner);
		for(let i=0; i<admins.length; i++){
			new_members.push(admins[i]);
		}
		for(let i=0; i<team_leaders.length; i++){
			new_members.push(team_leaders[i]);
		}
		for(let i=0; i<team_members.length; i++){
			new_members.push(team_members[i]);
		}
		// Overrwrite the State
		this.setState({
			members: new_members
		})
	}
	
	sort_by_role_channels = () => {
		for(let i=0; i<channels.length; i++){
			let org_owner;
			let admins = [];
			let team_leaders = [];
			let team_members = [];

			let temp = channels[i].members;
			
			for(let j=0; j<temp.length; j++){
				if(temp[j].role === "ORG_OWNER") {
					org_owner = temp[j];
				} else if(temp[j].role === "ADMIN") {
					admins.push(temp[j]);
				} else if(temp[j].role === "TEAM_LEADER") {
					team_leaders.push(temp[j]);
				} else {
					team_members.push(temp[j]);
				}
			}
			
			// Sort the Arrays by Alphabetical Order
			admins = admins.sort(this.sort_by_alphabetical_order);
			team_leaders = team_leaders.sort(this.sort_by_alphabetical_order);
			team_members = team_members.sort(this.sort_by_alphabetical_order);
			
			// Create the New this.state.members
			let new_members = [];
			if(org_owner != null) {
				new_members.push(org_owner);
			}
			for(let k=0; k<admins.length; k++){
				new_members.push(admins[k]);
			}
			for(let k=0; k<team_leaders.length; k++){
				new_members.push(team_leaders[k]);
			}
			for(let k=0; k<team_members.length; k++){
				new_members.push(team_members[k]);
			}
			// Replace the Members List in the Channel
			channels[i].members = new_members;		
		}
	}
	
	sort_by_alphabetical_order = (a, b) => {
		const user_a_name = org_member_details.get(a.username).name.toUpperCase();
		const user_b_name = org_member_details.get(b.username).name.toUpperCase();
		
		let comparison; 
		if(user_a_name > user_b_name) {
			comparison = 1;
		} else if(user_a_name < user_b_name) {
			comparison = -1;
		}
		return comparison;
	};
	sort_by_alphabetical_order_pending = (a, b) => {
		const user_a_name = a.fname.toUpperCase()+" "+a.lname.toUpperCase();
		const user_b_name = b.fname.toUpperCase()+" "+b.lname.toUpperCase();
		
		let comparison; 
		if(user_a_name > user_b_name) {
			comparison = 1;
		} else if(user_a_name < user_b_name) {
			comparison = -1;
		}
		return comparison;
	};
	
	load_org_member_details(){
		// Create the Map for the Member Details
		OrgsResources.retrieve_basic_users_in_orgs(this.state.members).then((response) => {
			// Go through the Response Data which is the Basic User and Strip Data
			for(let i=0; i<response.data.length; i++){
				//console.log(response.data[i]);
				let user_details = {
					fname: response.data[i].fname,
					lname: response.data[i].lname,
					name: response.data[i].fname + " " +response.data[i].lname,
					bio: response.data[i].bio,
					image_path: response.data[i].image_path,
				}
				// Add them to the Details Map
				org_member_details.set(response.data[i].username, user_details);
			}
			this.setState({
				member_details_loaded: true,
			});
			// Sort this.state.members to correct Heirarchy
			this.sort_by_role();
			// Sort this.state.channel[i].members to correct Heirarchy
			this.sort_by_role_channels();
			this.forceUpdate();
		});
	};
	
	invite_user = (invitee) => {
		OrgsResources.invite_to_org(this.state.username, invitee, this.state.org_id).then((response) => {
			alert("User Successfully Emailed");
			searched_users = [];
			// Resetting Fields
			this.setState({
				search_key: "",
				invite_sent: true,
			})
		});
	};
	remove_invited_user = (unique_id) => {
		OrgsResources.remove_invited_user_from_org(this.state.username, unique_id).then((response) => {
			pending_users = [];
			// Re-render the Page
			this.setState({
				invite_sent: true
			});
		});
	};
	
	add_users_to_channel(channel_title) {
		current_members_in_channel = [];
		// Get the Current Channel Members
		for(let i=0; i<channels.length; i++){
			if(channels[i].channel_title === channel_title){
				current_members_in_channel = channels[i].members;
				break;
			}
		}
		this.setState({
			show_add_users: !this.state.show_add_users,
			temp_channel_title: channel_title,
		});
	}
	add_users_to_channel_exit = () => {
		current_members_in_channel = [];
		this.setState({
			show_add_users: !this.state.show_add_users,
			temp_channel_title: "",
		});
	}
	
	// Maps all the OrgUsers
	mapOrgUsers(mapper) {
		let retDiv;
		// Ensure the Map Has Data
		console.log(org_member_details);
		if(org_member_details.size > 0) {
			retDiv = mapper.map((member) => {
				return (
					<ListGroup.Item
						key={member.username}
						variant={this.setRoleStyling(member.role)}>
						{org_member_details.get(member.username).name}
					</ListGroup.Item>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}
	
	// Maps all the Searched and Pending Users
	mapNonOrgUsers(mapper) {
		let retDiv;
		// Ensure the Array Has Data
		if(mapper.length > 0) {
			retDiv = mapper.map((usr) => {
				return (
					<ListGroup.Item key={usr.username}>
						{usr.fname} {usr.lname}
					</ListGroup.Item>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}
	// Maps all the Searched User Buttons
	mapSearchedUsersButtons() {
		let retDiv;
		// Ensure the Array Has Data
		if(searched_users.length > 0) {
			retDiv = searched_users.map((usr, c) => {
				return (
					<Button key={usr.username} size="lg" variant="outline-dark" onClick={() => this.invite_user(usr.username)}>
						<i className="fas fa-plus"></i>
					</Button>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}
	// Maps all the Searched User Buttons
	mapPendingUsersButtons() {
		let retDiv;
		// Ensure the Array Has Data
		if(pending_users.length > 0) {
			retDiv = pending_users.map((usr) => {
				return (
					<Button key={usr.username} size="lg" variant="outline-dark" onClick={() => this.remove_invited_user(this.state.org_id+"."+usr.username)}>
						<i className="fas fa-minus"></i>
					</Button>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}
	
	render() {
		console.log("System - Rendering Page...");
		return (
			<div className="app-window update-org-component">
				<Container fluid>
					<Form
						noValidate
						validated={this.state.validated}
						className="update-org-form">
						<h1>Update: <strong>{this.state.org_title}</strong></h1>
						<Row>
							<Col>
								<Form.Group>
									<Form.Label>Org ID</Form.Label>
									<Form.Control
										type="text"
										name="id"
										id="org_id"
										value={this.state.org_id}
										placeholder="Organisation ID"
										disabled
									/>
									<Form.Control.Feedback type="invalid">
										{this.state.errors.id}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group>
									<Form.Label>Change Org Title</Form.Label>
									<Form.Control
										type="text"
										name="title"
										id="org_title"
										value={this.state.org_title}
										onChange={this.handle_typing_org_title}
										placeholder="Organisation Title"
									/>
									<Form.Control.Feedback type="invalid">
										{this.state.errors.title}
									</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>
						<Row className="pt-2">
							<Col>
								<Container>
									<Row>
										<h3>Member List</h3>
									</Row>

									<ListGroup className="overflow-auto">
									{this.mapOrgUsers(this.state.members)}
									</ListGroup>
								</Container>
							</Col>
							<Col>
								<Container>
									<Row>
										<Col>
											<h3>Channels</h3>
										</Col>
										<Col md={1}>
											<Button
												variant="outline-dark"
												onClick={this.handle_create_channel}>
												<i className="fas fa-plus"></i>
											</Button>
										</Col>
									</Row>
									<Row>
										<Col>
											<ListGroup className="overflow-auto">
												{channels.map((ch) => (
													<ListGroup.Item
														key={ch.channel_title}
														className="channels"
														variant="dark">
														<div className="d-flex justify-content-between">
															{ch.channel_title}
															<ButtonGroup className="align-self-end">
																<Button
																	variant="secondary"
																	className="btn-sm"
																	onClick={() =>
																		this.toggleMemberListDisplay(
																			ch.channel_title
																		)
																	}>
																	{this.state.memberListOpen[
																		ch.channel_title
																	] ? (
																		<i className="fas fa-angle-up"></i>
																	) : (
																		<i className="fas fa-caret-down"></i>
																	)}
																</Button>
																<Button
																	variant="dark"
																	className="btn-sm"
																	onClick={() => this.add_users_to_channel(ch.channel_title)}>
																	<i class="fas fa-user-plus"></i>
																</Button>
																<Button
																	variant="dark"
																	className="btn-sm"
																	onClick={() =>
																		this.handle_update_channel(
																			ch.channel_title
																		)
																	}>
																	<i className="fas fa-edit"></i>
																</Button>

																<Button
																	className="btn-sm"
																	variant="warning"
																	onClick={() =>
																		this.handle_delete_channel(
																			ch.channel_title
																		)
																	}>
																	<i className="fas fa-trash"></i>
																</Button>
															</ButtonGroup>
														</div>

														<ListGroup
															style={{
																display: this.state.memberListOpen[
																	ch.channel_title
																]
																	? "flex"
																	: "none",
															}}>
															{this.mapOrgUsers(ch.members)}
														</ListGroup>
													</ListGroup.Item>
												))}
											</ListGroup>
										</Col>
									</Row>
								</Container>
							</Col>
						</Row>
						<Row className="pt-3">
							<Col>
								<Container>
									<Row>
										<h3>Invite a <strong>New User</strong></h3>
									</Row>
									<Row>
										<input
											type="text"
											id="search_user"
											value={this.state.search_key}
											onChange={this.handle_typing_search_key}
											placeholder="Enter the Name of the User"
											onKeyPress={(event) => {
												if (event.key === "Enter") {
													this.handle_search_new_users();
												}
											}}
										/>
									</Row>
									<Row>
										<Col>
											<ListGroup className="overflow-auto">
												{this.mapNonOrgUsers(searched_users)}
											</ListGroup>
										</Col>
										<Col md={0.5}>
											<ButtonGroup vertical>
												{this.mapSearchedUsersButtons()}
											</ButtonGroup>
										</Col>
									</Row>
								</Container>
							</Col>
							<Col>
								<Container>
									<Row>
										<h3>Pending User Invites</h3>
									</Row>
									<Row>
										<Col>
											<ListGroup className="overflow-auto">
												{this.mapNonOrgUsers(pending_users)}
											</ListGroup>
										</Col>
										<Col md={0.5}>
											<ButtonGroup vertical>
												{this.mapPendingUsersButtons()}
											</ButtonGroup>
										</Col>
									</Row>
								</Container>
							</Col>
						</Row>
						<Row className="fixed-bottom justify-content-end">
							<Form.Group md="0.5" as={Col}>
								<Button
									type="button"
									variant="outline-primary"
									onClick={this.handleCancel}>
									Go Back
								</Button>
							</Form.Group>
							<Form.Group md="2" as={Col}>
								<Button
									id="org_update"
									type="button"
									variant="secondary"
									style={{whiteSpace: "nowrap"}}
									onClick={() => this.on_submit.bind(this)}
									>
									Update Organisation
								</Button>
							</Form.Group>
						</Row>
					</Form>
				</Container>
				{this.state.show_add_users ? (
					<AddUserToChannelComponent
						handler={this.add_users_to_channel_exit}
						org_id={this.state.org_id}
						channel_title={this.state.temp_channel_title}
						members={this.state.members}
						org_member_details={org_member_details}
						current_members_in_channel={current_members_in_channel}
					/>
				) : null}
			</div>
		);
	}
}

export default UpdateOrgsComponent;
