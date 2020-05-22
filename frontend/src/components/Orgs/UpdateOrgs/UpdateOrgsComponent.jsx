import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import AddUserToChannelComponent from "../Channels/AddUserToChannelComponent.jsx";
import RemoveUserFromChannelComponent from "../Channels/RemoveUserFromChannelComponent.jsx";
import "./UpdateOrgsComponent.css";
import MemberListComponent from "./MemberListComponent.jsx";
import ChannelListComponent from "./ChannelListComponent.jsx";
import {
	Container,
	Form,
	Button,
	ButtonGroup,
	Row,
	Col,
	ListGroup,
	Toast,
	FormControl,
	Tabs,
	Tab,
	Tooltip,
	OverlayTrigger,
} from "react-bootstrap";

/*
	Left to do:
	Styling the Search User Textbox
	Completing the Autocomplete for the Search User Textbook using the current_namespace
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
			owned_ids: [],
			memberListOpen: [],
			errors: [],
			invite_sent: false,
			show_add_users: false,
			show_remove_users: false,
			temp_channel_title: "",
			deleteOrgInputError: "",
			deleteOrgButtonDisabled: true,
			orgIdValidated: false,
			alerts: [],
		};
		this.on_submit = this.on_submit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.invite_user = this.invite_user.bind(this);
		this.add_users_to_channel = this.add_users_to_channel.bind(this);
		this.remove_users_from_channel = this.remove_users_from_channel.bind(this);
		this.handleDeleteOrg = this.handleDeleteOrg.bind(this);
		this.handleDeleteCheck = this.handleDeleteCheck.bind(this);
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
		// 	}
		// }

		let form = e.currentTarget;
		var formControl = Array.prototype.slice.call(form.querySelectorAll(".form-control"));

		//Iterate over input fields and get corresponding error
		//Flag form as invalid if there is an error
		formControl.forEach((ele) => {
			if (errors[ele.name]) {
				ele.setCustomValidity("invalid");
			} else {
				ele.setCustomValidity("");
			}
		});

		this.setState({errors: errors});
		return formIsValid;
	}

	on_submit = (e) => {
		e.preventDefault();

		if (this.handleValidation(e)) {
			let org_push = {
				org_id: this.state.org_id,
				org_title: this.state.org_title,
				channels: channels,
				members: this.state.members,
			};
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
		OrgsResources.delete_channel(this.state.username, this.state.org_id, channel_title).then(
			(response) => {
				// Reset the Channels Variable
				channels = [];
				// Retrieves All Channels from the Org Data
				OrgsResources.retrieve_org(this.state.username, this.state.old_org_id).then(
					(response) => {
						channels = response.data.channels;
						this.forceUpdate();
					}
				);
				this.setState((prevState) => ({
					alerts: [...prevState.alerts, `Channel ${channel_title} successfully deleted`],
				}));
			}
		);
	};
	handle_update_channel = (channel) => {
		var url = this.props.history.location.pathname + "/" + channel.channel_title;
		this.props.history.push({
			pathname: url,
			state: {channel: channel},
		});
	};

	handleCancel() {
		this.props.history.goBack();
	}

	handleDeleteCheck(e) {
		this.setState({deleteOrgButtonDisabled: !e.target.checked});
	}

	handleDeleteOrg(e) {
		e.preventDefault();
		let valid = true;
		let error = "";
		const deleteOrgInput = document.getElementById("deleteOrgInput");
		if (document.getElementById("deleteOrgCheck").checked) {
			if (deleteOrgInput.value === this.state.org_id) {
				OrgsResources.delete_org(this.state.username, this.state.org_id).then(() => {
					this.props.history.goBack();
				});
			} else {
				valid = false;
				error = "Input must match the Org ID";
			}
		} else {
			valid = false;
			error = "Checkbox must be checked";
		}

		if (!valid) {
			deleteOrgInput.setCustomValidity("invalid");
		}

		this.setState({deleteOrgInputError: error, orgIdValidated: true});
	}

	componentDidUpdate() {
		// Update the Pending Users List
		if (this.state.invite_sent === true) {
			OrgsResources.retrieve_pending_users_in_orgs(this.state.org_id).then((response) => {
				// if there is no Data, Don't Sort
				if (response.data != "") {
					pending_users = response.data.sort(this.sort_by_alphabetical_order_pending);
				} else {
					pending_users = response.data;
				}
				this.setState({
					invite_sent: false,
				});
			});
		}
	}

	componentDidMount() {
		OrgsResources.retrieve_pending_users_in_orgs(this.state.org_id).then((response) => {
			// if there is no Data, Don't Sort
			if (response.data != "") {
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
		OrgsResources.retrieve_org(this.state.username, this.state.old_org_id)
			.then((response) => {
				channels = response.data.channels;
				this.setState(
					{
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
			})
			.then(() => {
				this.load_org_member_details();
			});
		OrgsResources.retrieve_all_name_space().then((response) => {
			current_namespace = response.data.sort();
		});
	}

	loadOrg() {
		// Retrieves All the Current Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.old_org_id)
			.then((response) => {
				channels = response.data.channels;
				this.setState(
					{
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
			})
			.then(() => {
				this.load_org_member_details();
			});
	}

	handle_search_new_users = () => {
		if (this.state.search_key != "") {
			// Search for the Users Specified and Update Area
			OrgsResources.retrieve_all_basic_users_by_name(this.state.search_key).then(
				(response) => {
					// Assign the Searched Users that Are Not in the Org to the Array
					searched_users = [];
					// Create a Temporary Map for the Pending Users
					const temp_map = new Map();
					for (let i = 0; i < pending_users.length; i++) {
						temp_map.set(pending_users[i].username, pending_users[i]);
					}
					var temp = response.data.sort(this.sort_by_alphabetical_order_pending);
					for (let i = 0; i < temp.length; i++) {
						if (
							!org_member_details.has(temp[i].username) &&
							!temp_map.has(temp[i].username)
						) {
							searched_users.push(temp[i]);
						}
					}
					// Re-render the Page to Display Array
					this.setState({
						search_key: "",
					});
				}
			);
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
			ret = "owner";
		} else if (role === "ADMIN") {
			ret = "admin";
		} else if (role === "TEAM_LEADER") {
			ret = "leader";
		}

		return ret;
	};

	sort_by_role = () => {
		let org_owner;
		let admins = [];
		let team_leaders = [];
		let team_members = [];

		let temp = this.state.members;
		for (let i = 0; i < temp.length; i++) {
			if (temp[i].role === "ORG_OWNER") {
				org_owner = temp[i];
			} else if (temp[i].role === "ADMIN") {
				admins.push(temp[i]);
			} else if (temp[i].role === "TEAM_LEADER") {
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
		for (let i = 0; i < admins.length; i++) {
			new_members.push(admins[i]);
		}
		for (let i = 0; i < team_leaders.length; i++) {
			new_members.push(team_leaders[i]);
		}
		for (let i = 0; i < team_members.length; i++) {
			new_members.push(team_members[i]);
		}
		// Overrwrite the State
		this.setState({
			members: new_members,
		});
	};

	sort_by_role_channels = () => {
		for (let i = 0; i < channels.length; i++) {
			let org_owner;
			let admins = [];
			let team_leaders = [];
			let team_members = [];

			let temp = channels[i].members;

			for (let j = 0; j < temp.length; j++) {
				if (temp[j].role === "ORG_OWNER") {
					org_owner = temp[j];
				} else if (temp[j].role === "ADMIN") {
					admins.push(temp[j]);
				} else if (temp[j].role === "TEAM_LEADER") {
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
			if (org_owner != null) {
				new_members.push(org_owner);
			}
			for (let k = 0; k < admins.length; k++) {
				new_members.push(admins[k]);
			}
			for (let k = 0; k < team_leaders.length; k++) {
				new_members.push(team_leaders[k]);
			}
			for (let k = 0; k < team_members.length; k++) {
				new_members.push(team_members[k]);
			}
			// Replace the Members List in the Channel
			channels[i].members = new_members;
		}
	};

	sort_by_alphabetical_order = (a, b) => {
		const user_a_name = org_member_details.get(a.username).name.toUpperCase();
		const user_b_name = org_member_details.get(b.username).name.toUpperCase();

		let comparison;
		if (user_a_name > user_b_name) {
			comparison = 1;
		} else if (user_a_name < user_b_name) {
			comparison = -1;
		}
		return comparison;
	};
	sort_by_alphabetical_order_pending = (a, b) => {
		const user_a_name = a.fname.toUpperCase() + " " + a.lname.toUpperCase();
		const user_b_name = b.fname.toUpperCase() + " " + b.lname.toUpperCase();

		let comparison;
		if (user_a_name > user_b_name) {
			comparison = 1;
		} else if (user_a_name < user_b_name) {
			comparison = -1;
		}
		return comparison;
	};

	load_org_member_details() {
		// Create the Map for the Member Detail
		org_member_details.clear();
		OrgsResources.retrieve_basic_users_in_orgs(this.state.members).then((response) => {
			// Go through the Response Data which is the Basic User and Strip Data
			for (let i = 0; i < response.data.length; i++) {
				let user_details = {
					fname: response.data[i].fname,
					lname: response.data[i].lname,
					role: response.data[i].role,
					name: response.data[i].fname + " " + response.data[i].lname,
					bio: response.data[i].bio,
					image_path: response.data[i].image_path,
				};
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

			// Check if they are in the Organisation
			if (org_member_details.has(this.state.username)) {
				// Check if they have Sufficient Permissions
				if (
					org_member_details.get(this.state.username).role === "ORG_OWNER" ||
					org_member_details.get(this.state.username).role === "ADMIN"
				) {
					this.setState({
						is_verifed: true,
					});
				} else {
					alert("You don't have permissions to view this page");
					this.props.history.goBack();
				}
			}
		});
	}

	invite_user = (invitee) => {
		searched_users = [];
		OrgsResources.invite_to_org(this.state.username, invitee, this.state.org_id).then(
			(response) => {
				this.setState((prevState) => ({
					alerts: [...prevState.alerts, "User Successfully Emailed"],
				}));
				// Resetting Fields
				this.setState({
					search_key: "",
					invite_sent: true,
				});
			}
		);
	};
	remove_invited_user = (unique_id) => {
		OrgsResources.remove_invited_user_from_org(this.state.username, unique_id).then(
			(response) => {
				pending_users = [];
				// Re-render the Page
				this.setState({
					invite_sent: true,
				});
			}
		);
	};

	add_users_to_channel(channel_title) {
		current_members_in_channel = [];
		// Get the Current Channel Members
		for (let i = 0; i < channels.length; i++) {
			if (channels[i].channel_title === channel_title) {
				current_members_in_channel = channels[i].members;
				break;
			}
		}
		this.setState({
			show_add_users: !this.state.show_add_users,
			temp_channel_title: channel_title,
		});
	}
	remove_users_from_channel(channel_title) {
		current_members_in_channel = [];
		// Get the Current Channel Members
		for (let i = 0; i < channels.length; i++) {
			if (channels[i].channel_title === channel_title) {
				current_members_in_channel = channels[i].members;
				break;
			}
		}
		this.setState({
			show_remove_users: !this.state.show_remove_users,
			temp_channel_title: channel_title,
		});
	}
	on_exit = () => {
		current_members_in_channel = [];
		this.setState({
			show_add_users: false,
			show_remove_users: false,
			temp_channel_title: "",
		});
	};

	// Promoting and Demoting Members
	manage_member = (username, type) => {
		let auth = {
			username: this.state.username,
			role: org_member_details.get(this.state.username).role,
		};
		let member = {
			username: username,
			role: org_member_details.get(username).role,
		};

		let newRole = "";
		//Error checking in MemberListComponent
		if (type === "promote") {
			if (member.role === "TEAM_LEADER") {
				newRole = "ADMIN";
			} else if (member.role === "TEAM_MEMBER") {
				newRole = "TEAM_LEADER";
			}
		} else if (type === "demote") {
			if (member.role === "ADMIN") {
				newRole = "TEAM_LEADER";
			} else if (member.role === "TEAM_LEADER") {
				newRole = "TEAM_MEMBER";
			}
		}

		let new_managed = {
			username: username,
			role: newRole,
		};
		let body = [];
		body.push(auth);
		body.push(member);
		body.push(new_managed);
		// Push Request to Server
		OrgsResources.manage_users_in_org(this.state.org_id, body).then((response) => {
			this.setState((prevState) => ({
				alerts: [...prevState.alerts, "User has been Modified"],
			}));

			// Reload the Page as Alot of Modifications can Occur
			this.loadOrg();
		});
	};
	// Completely Removing a User from the Org

	remove_member = (username) => {
		let old_member = {
			username: username,
			role: org_member_details.get(username).role,
		};
		// Push Request to Server
		OrgsResources.remove_user_from_org(this.state.org_id, old_member).then((response) => {
			this.setState((prevState) => ({
				alerts: [...prevState.alerts, "User has been Removed"],
			}));

			// Reload the Page as Alot of Modifications can Occur
			this.loadOrg();
		});
	};

	// Maps all the Searched and Pending Users
	mapNonOrgUsers(mapper, is_searched) {
		let retDiv;
		// Ensure the Array Has Data
		if (mapper.length > 0) {
			retDiv = mapper.map((usr) => {
				return (
					<ListGroup.Item key={`pending-${usr.username}`} className="bg-light text-dark">
						<div className="d-flex justify-content-between">
							<p>
								{usr.fname} {usr.lname}
							</p>
							<ButtonGroup className="align-self-end">
								{this.mapNonOrgUsersButtons(is_searched, usr.username)}
							</ButtonGroup>
						</div>
					</ListGroup.Item>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}

	// Maps all the Searched User Buttons
	mapNonOrgUsersButtons(is_searched, username) {
		let retDiv;
		if (is_searched) {
			retDiv = (
				<OverlayTrigger delay={{ show: 400, hide: 0 }} placement="bottom" overlay={<Tooltip>Invite</Tooltip>}>
					<Button
						key={username + "invite"}
						variant="success"
						onClick={() => this.invite_user(username)}>
						<i className="fas fa-plus"></i>
					</Button>
				</OverlayTrigger>
			);
		} else {
			retDiv = (
				<OverlayTrigger delay={{ show: 400, hide: 0 }} placement="bottom" overlay={<Tooltip>Remove</Tooltip>}>
					<Button
						key={username + "destroy"}
						variant="danger"
						onClick={() =>
							this.remove_invited_user(this.state.org_id + "." + username)
						}>
						<i className="fas fa-times"></i>
					</Button>
				</OverlayTrigger>
			);
		}

		return retDiv;
	}

	handleToastAlertClose(index) {
		let newArr = this.state.alerts;
		newArr.splice(index, 1);
		this.setState({alerts: newArr});
	}

	mapToastAlerts() {
		let toasts = this.state.alerts.map((alert, index) => {
			return (
				<Toast key={index} onClose={() => this.handleToastAlertClose(index)}>
					<Toast.Header>
						<strong className="mr-auto">Update Orgs</strong>
					</Toast.Header>
					<Toast.Body>{alert}</Toast.Body>
				</Toast>
			);
		});

		return <div style={{position: "absolute", top: 0, right: 0}}>{toasts}</div>;
	}

	render() {
		return !this.state.is_verifed ? null : (
			<div className="app-window update-org-component">
				<Container fluid>
					<Form noValidate validated={this.state.validated}>
						<h1>
							Update Org: <strong>{this.state.org_title}</strong>
						</h1>
						<Row>
							<Col>
								<Form.Group>
									<Form.Label>Org ID</Form.Label>
									<Form.Control
										type="text"
										name="id"
										id="org_id"
										disabled="true"
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
					</Form>

					<Tabs defaultActiveKey="members">
						<Tab eventKey="members" style={{height: "1rem"}} title="Member List">
							<Container fluid>
								<Row>
									<Col>
										<Row>
											<Col>
												<h3>Member List</h3>
											</Col>
										</Row>
										{this.state.members.length > 0 &&
										org_member_details.size > 0 ? (
											<MemberListComponent
												show_buttons={true}
												username={this.state.username}
												members={this.state.members}
												org_member_details={org_member_details}
												manage_member={this.manage_member}
												remove_member={this.remove_member}
											/>
										) : null}
									</Col>
									<Col>
										<Container fluid className="org-new-users overflow-auto">
											<Row className="org-new-users">
												<h3>
													Invite a <strong>New User</strong>
												</h3>
											</Row>
											<Row>
												<FormControl
													className="org-new-users"
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
												<ListGroup className="org-new-users">
													{this.mapNonOrgUsers(searched_users, true)}
												</ListGroup>
											</Row>
										</Container>
									</Col>
								</Row>
							</Container>
						</Tab>
						<Tab eventKey="channels" style={{height: "1rem"}} title="Channels">
							<Container fluid>
								<Row>
									<Col>
										<h3>Channels</h3>
									</Col>
									<Col md={1}>
										<OverlayTrigger delay={{ show: 400, hide: 0 }}
											placement="left"
											overlay={<Tooltip>Create New A Channel</Tooltip>}>
											<Button
												variant="outline-dark"
												onClick={this.handle_create_channel}>
												<i className="fas fa-plus"></i>
											</Button>
										</OverlayTrigger>
									</Col>
								</Row>
								<Row>
									<Col>
										<ChannelListComponent
											channels={channels}
											username={this.state.username}
											org_member_details={org_member_details}
											handle_delete_channel={this.handle_delete_channel}
											add_users_to_channel={this.add_users_to_channel}
											remove_users_from_channel={
												this.remove_users_from_channel
											}
											handle_update_channel={this.handle_update_channel}
										/>
									</Col>
								</Row>
							</Container>
						</Tab>
						<Tab eventKey="pending" style={{height: "1rem"}} title="Pending">
							<Container fluid className="org-new-users overflow-auto">
								<Row>
									<h3>Pending User Invites</h3>
								</Row>
								<Row>
									<ListGroup className="org-new-users">
										{this.mapNonOrgUsers(pending_users, false)}
									</ListGroup>
								</Row>
							</Container>
						</Tab>
						{org_member_details.get(this.state.username).role === "ORG_OWNER" ? (
							<Tab eventKey="delete" style={{height: "1rem"}} title="Delete">
								<Container>
									<Row>
										<h3>Delete the organisation</h3>
									</Row>
									<Row>
										<Form noValidate validated={this.state.orgIdValidated}>
											<Form.Group>
												<Form.Label>
													Type the organisation ID to delete
												</Form.Label>
												<Form.Control
													id="deleteOrgInput"
													placeholder="Organisation ID"
												/>
												<Form.Control.Feedback type="invalid">
													{this.state.deleteOrgInputError}
												</Form.Control.Feedback>
											</Form.Group>
										</Form>
									</Row>
									<Row className="d-flex flex-column">
										<Form.Check
											id="deleteOrgCheck"
											type="checkbox"
											onClick={this.handleDeleteCheck}
											label={`Are you sure you want to delete ${this.state.org_title}?`}
										/>

										<p>
											<small>
												(Once the organisation is deleted, all channels and
												instances with be PERMANENTLY removed)
											</small>
										</p>
										<Button
											type="button"
											id="deleteButton"
											onClick={this.handleDeleteOrg}
											size="lg"
											variant="danger"
											style={{width: "fit-content"}}
											disabled={this.state.deleteOrgButtonDisabled}>
											Delete
										</Button>
									</Row>
								</Container>
							</Tab>
						) : null}
					</Tabs>

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
								onClick={() => this.on_submit.bind(this)}>
								Update Organisation
							</Button>
						</Form.Group>
					</Row>
				</Container>
				{this.state.show_add_users ? (
					<AddUserToChannelComponent
						handler={this.on_exit}
						org_id={this.state.org_id}
						channel_title={this.state.temp_channel_title}
						members={this.state.members}
						org_member_details={org_member_details}
						current_members_in_channel={current_members_in_channel}
					/>
				) : null}
				{this.state.show_remove_users ? (
					<RemoveUserFromChannelComponent
						handler={this.on_exit}
						org_id={this.state.org_id}
						channel_title={this.state.temp_channel_title}
						org_member_details={org_member_details}
						current_members_in_channel={current_members_in_channel}
					/>
				) : null}
				{this.mapToastAlerts()}
			</div>
		);
	}
}

export default UpdateOrgsComponent;
