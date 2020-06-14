import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
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

var channels = [];
var searchedUsers = [];
var pendingUsers = [];
var currentNamespace = [];
const orgMemberDetails = new Map();

class UpdateOrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),

			orgId: this.props.match.params.org_id,
			oldOrgId: this.props.match.params.org_id,
			orgTitle: "",
			searchKey: "",
			members: [],
			ownedIds: [],
			memberListOpen: [],
			errors: [],
			inviteSent: false,
			showAddUsers: false,
			showRemoveUsers: false,
			tempChannelTitle: "",
			deleteOrgInputError: "",
			deleteOrgButtonDisabled: true,
			orgIdValidated: false,
			alerts: [],
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleDeleteOrg = this.handleDeleteOrg.bind(this);
		this.handleDeleteCheck = this.handleDeleteCheck.bind(this);
	}

	handleValidation(e) {
		var formIsValid = true;
		var str2 = this.state.orgId;
		var errors = {};
		if (this.state.orgId.length < 3 || this.state.orgId === "new") {
			errors.id = "Org ID is too short";
			formIsValid = false;
		} else {
			// Check if the ID Exists
			for (let i = 0; i < this.state.ownedIds.length; i++) {
				var str1 = this.state.ownedIds[i].org_id;
				// Compare the String Values
				if (str1.valueOf() === str2.valueOf()) {
					formIsValid = false;
					errors.id = "Org ID already used";
					break;
				}
			}
		}
		// Ensure Length is 3 or Greater
		if (this.state.orgTitle.length < 3) {
			errors.title = "Org Title is too short";
			formIsValid = false;
		}

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

	onSubmit = (e) => {
		e.preventDefault();

		if (this.handleValidation(e)) {
			let org_push = {
				org_id: this.state.orgId,
				org_title: this.state.orgTitle,
				channels: channels,
				members: this.state.members,
			};
			OrgsResources.update_org(this.state.username, this.state.oldOrgId, org_push).then(() =>
				this.props.history.goBack()
			);
		}

		this.setState({validated: true});
	};
	handleTypingOrgTitle = (event) => {
		this.setState({
			orgTitle: event.target.value,
			error: false,
		});
	};
	handleTypingSearchKey = (event) => {
		this.setState({
			searchKey: event.target.value.replace(/[^a-zA-Z ']/gi, ""),
		});
	};

	handleCreateChannel = () => {
		var url = this.props.history.location.pathname + "/new";
		this.props.history.push(url);
	};
	handleDeleteChannel = (channel_title) => {
		OrgsResources.delete_channel(this.state.username, this.state.orgId, channel_title).then(
			(response) => {
				// Reset the Channels Variable
				channels = [];
				// Retrieves All Channels from the Org Data
				OrgsResources.retrieve_org(this.state.username, this.state.oldOrgId).then(
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
	handleUpdateChannel = (channel) => {
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
			if (deleteOrgInput.value === this.state.orgId) {
				OrgsResources.delete_org(this.state.username, this.state.orgId).then(() => {
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
		if (this.state.inviteSent === true) {
			OrgsResources.retrieve_pending_users_in_orgs(this.state.orgId).then((response) => {
				// if there is no Data, Don't Sort
				if (response.data !== "") {
					pendingUsers = response.data.sort(this.sortByAlphabeticalOrderPending);
				} else {
					pendingUsers = response.data;
				}
				this.setState({
					inviteSent: false,
				});
			});
		}
	}

	componentDidMount() {
		OrgsResources.retrieve_pending_users_in_orgs(this.state.orgId).then((response) => {
			// if there is no Data, Don't Sort
			if (response.data !== "") {
				pendingUsers = response.data.sort(this.sortByAlphabeticalOrderPending);
			} else {
				pendingUsers = response.data;
			}
		});
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				// They Can Claim the Same ID
				if (this.state.orgId !== response.data[i]) {
					this.state.ownedIds.push({
						org_id: response.data[i],
					});
					this.setState({
						ownedIds: this.state.ownedIds,
					});
				}
			}
		});
		// Retrieves All the Current Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.oldOrgId)
			.then((response) => {
				channels = response.data.channels;
				this.setState(
					{
						orgId: response.data.org_id,
						orTitle: response.data.org_title,
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
				this.loadOrgMemberDetails();
			});
		OrgsResources.retrieve_all_name_space().then((response) => {
			currentNamespace = response.data.sort();
		});
	}

	loadOrg() {
		// Retrieves All the Current Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.oldOrgId)
			.then((response) => {
				channels = response.data.channels;
				this.setState(
					{
						orgId: response.data.org_id,
						orgTitle: response.data.org_title,
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
				this.loadOrgMemberDetails();
			});
	}

	handleSearchNewUsers = () => {
		if (this.state.searchKey !== "") {
			// Search for the Users Specified and Update Area
			OrgsResources.retrieve_all_basic_users_by_name(this.state.searchKey).then(
				(response) => {
					// Assign the Searched Users that Are Not in the Org to the Array
					searchedUsers = [];
					// Create a Temporary Map for the Pending Users
					const temp_map = new Map();
					for (let i = 0; i < pendingUsers.length; i++) {
						temp_map.set(pendingUsers[i].username, pendingUsers[i]);
					}
					var temp = response.data.sort(this.sortByAlphabeticalOrderPending);
					for (let i = 0; i < temp.length; i++) {
						if (
							!orgMemberDetails.has(temp[i].username) &&
							!temp_map.has(temp[i].username)
						) {
							searchedUsers.push(temp[i]);
						}
					}
					// Re-render the Page to Display Array
					this.setState({
						searchKey: "",
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

	sortByRole = () => {
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
		admins = admins.sort(this.sortByAlphabeticalOrder);
		team_leaders = team_leaders.sort(this.sortByAlphabeticalOrder);
		team_members = team_members.sort(this.sortByAlphabeticalOrder);

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

	sortByRoleChannels = () => {
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
			admins = admins.sort(this.sortByAlphabeticalOrder);
			team_leaders = team_leaders.sort(this.sortByAlphabeticalOrder);
			team_members = team_members.sort(this.sortByAlphabeticalOrder);

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

	sortByAlphabeticalOrder = (a, b) => {
		const user_a_name = orgMemberDetails.get(a.username).name.toUpperCase();
		const user_b_name = orgMemberDetails.get(b.username).name.toUpperCase();

		let comparison;
		if (user_a_name > user_b_name) {
			comparison = 1;
		} else if (user_a_name < user_b_name) {
			comparison = -1;
		}
		return comparison;
	};
	sortByAlphabeticalOrderPending = (a, b) => {
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

	loadOrgMemberDetails() {
		// Create the Map for the Member Detail
		orgMemberDetails.clear();
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
				orgMemberDetails.set(response.data[i].username, user_details);
			}
			this.setState({
				memberDetailsLoaded: true,
			});
			// Sort this.state.members to correct Heirarchy
			this.sortByRole();
			// Sort this.state.channel[i].members to correct Heirarchy
			this.sortByRoleChannels();

			// Check if they are in the Organisation
			if (orgMemberDetails.has(this.state.username)) {
				// Check if they have Sufficient Permissions
				if (
					orgMemberDetails.get(this.state.username).role === "ORG_OWNER" ||
					orgMemberDetails.get(this.state.username).role === "ADMIN"
				) {
					this.setState({
						isVerifed: true,
					});
				} else {
					alert("You don't have permissions to view this page");
					this.props.history.goBack();
				}
			}
		});
	}
	
	// Promoting and Demoting Members
	manageMember = (username, type) => {
		let auth = {
			username: this.state.username,
			role: orgMemberDetails.get(this.state.username).role,
		};
		let member = {
			username: username,
			role: orgMemberDetails.get(username).role,
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
		OrgsResources.manage_users_in_org(this.state.orgId, body).then((response) => {
			this.setState((prevState) => ({
				alerts: [...prevState.alerts, "User has been Modified"],
			}));

			// Reload the Page as Alot of Modifications can Occur
			this.loadOrg();
		});
	};
	// Completely Removing a User from the Org
	removeMember = (username) => {
		let old_member = {
			username: username,
			role: orgMemberDetails.get(username).role,
		};
		// Push Request to Server
		OrgsResources.remove_user_from_org(this.state.orgId, old_member).then((response) => {
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
				<OverlayTrigger
					delay={{show: 400, hide: 0}}
					placement="bottom"
					overlay={<Tooltip>Invite</Tooltip>}>
					<Button
						key={username + "invite"}
						variant="success"
						onClick={() => this.inviteUser(username)}>
						<i className="fas fa-plus"></i>
					</Button>
				</OverlayTrigger>
			);
		} else {
			retDiv = (
				<OverlayTrigger
					delay={{show: 400, hide: 0}}
					placement="bottom"
					overlay={<Tooltip>Remove</Tooltip>}>
					<Button
						key={username + "destroy"}
						variant="danger"
						onClick={() => this.removeInvitedUser(this.state.orgId + "." + username)}>
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
				<Toast
					key={index}
					onClose={() => this.handleToastAlertClose(index)}
					delay={2000}
					autohide>
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
							Update Org: <strong>{this.state.orgTitle}</strong>
						</h1>
						<Row>
							<Col>
								<Form.Group>
									<Form.Label>Org ID</Form.Label>
									<Form.Control
										type="text"
										name="id"
										id="org_id"
										value={this.state.orgId}
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
										value={this.state.orgTitle}
										onChange={this.handleTypingOrgTitle}
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
										orgMemberDetails.size > 0 ? (
											<MemberListComponent
												show_buttons={true}
												username={this.state.username}
												members={this.state.members}
												org_member_details={orgMemberDetails}
												manage_member={this.manageMember}
												remove_member={this.removeMember}
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
													value={this.state.searchKey}
													onChange={this.handleTypingSearchKey}
													placeholder="Enter the Name of the User"
													onKeyPress={(event) => {
														if (event.key === "Enter") {
															this.handleSearchNewUsers();
														}
													}}
												/>
											</Row>
											<Row>
												<ListGroup className="org-new-users">
													{this.mapNonOrgUsers(searchedUsers, true)}
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
										<OverlayTrigger
											delay={{show: 400, hide: 0}}
											placement="left"
											overlay={<Tooltip>Create New A Channel</Tooltip>}>
											<Button
												variant="outline-dark"
												onClick={this.handleCreateChannel}>
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
											org_member_details={orgMemberDetails}
											handle_delete_channel={this.handleDeleteChannel}
											handle_update_channel={this.handleUpdateChannel}
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
										{this.mapNonOrgUsers(pendingUsers, false)}
									</ListGroup>
								</Row>
							</Container>
						</Tab>
						{orgMemberDetails.get(this.state.username).role === "ORG_OWNER" ? (
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
											label={`Are you sure you want to delete ${this.state.orgTitle}?`}
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
								onClick={() => this.onSubmit.bind(this)}>
								Update Organisation
							</Button>
						</Form.Group>
					</Row>
				</Container>
				
				{this.mapToastAlerts()}
			</div>
		);
	}
}

export default UpdateOrgsComponent;
