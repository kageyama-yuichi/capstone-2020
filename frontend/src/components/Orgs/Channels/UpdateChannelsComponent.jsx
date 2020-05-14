import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import "../OrgsComponent.css";
import {
	Container,
	Form,
	Button,
	Col,
	Row,
	Tab,
	Tabs,
	ListGroup,
	InputGroup,
	FormControl,
	OverlayTrigger,
	Tooltip
} from "react-bootstrap";
import MemberListComponent from "../UpdateOrgs/MemberListComponent";
import {Input} from "reactstrap";

const org_member_details = new Map();

class UpdateChannelsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			channel: props.location.state.channel,
			channel_title: props.match.params.channel_title,
			old_channel_title: props.match.params.channel_title,
			org_id: props.match.params.org_id,
			org: null,
			channel_title_error: "",
			owned_ids: [],
			member_details_loaded: false,
			members: props.location.state.channel.members,
			is_verifed: false,
			search_key: "",
			searched_users: [],
		};
		this.on_submit = this.on_submit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleAddInstanceClick = this.handleAddInstanceClick.bind(this);
	}

	on_submit = (e) => {
		e.preventDefault();
		var internal_error = false;
		var error = "";
		var str2 = this.state.channel_title;

		// Ensure Length is 3 or Greater
		if (this.state.channel_title.length < 3 || this.state.channel_title === "new") {
			error = "Channel title too short";
			internal_error = true;
		} else if (this.state.channel_title.length > 100) {
			// Max length 100
			error = "Channel title too long";
			internal_error = true;
		}

		if (!internal_error) {
			// Check if the ID Exists
			OrgsResources.validateChannelTitle(
				this.state.username,
				this.state.org_id,
				this.state.old_channel_title,
				this.state.channel_title
			).then((response) => {
				if (!response.data) {
					error = "ID already used";
					this.setState({
						channel_title_error: true,
					});
				} else {
					let channel = this.state.channel;
					channel.channel_title = this.state.channel_title;
					OrgsResources.update_channel(
						this.state.username,
						this.state.org_id,
						this.state.old_channel_title,
						channel
					).then(() => this.props.history.goBack());
				}
			});
		}

		if (error.length > 0) {
			document.getElementById("org_title").setCustomValidity("invalid");
		}

		this.setState({channel_title_error: error, validated: true});
	};

	handle_typing_channel_title = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			channel_title: event.target.value,
			channel_title_error: false,
		});
	};

	handle_typing_search_key = (event) => {
		this.setState({
			search_key: event.target.value.replace(/[^a-zA-Z ']/gi, ""),
		});
	};

	//Searches for members that are not in the channel but in the org
	handle_search_new_users = () => {
		if (this.state.search_key != "") {
			// Search for the Users Specified and Update Area

			// Assign the Searched Users that Are Not in the Org to the Array
			var searched_users = [];
			var search_key = this.state.search_key.toLowerCase();
			var filtered = new Map(org_member_details);
			for (var i in this.state.members) {
				if (filtered.has(this.state.members[i].username)) {
					filtered.delete(this.state.members[i].username);
				}
			}
			filtered.forEach((value, key) => {
				if (
					value.name.toLowerCase().search(search_key) !== -1 ||
					key.search(search_key) !== -1
				) {
					searched_users.push({username: key, value: value});
				}
			});

			this.setState({searched_users: searched_users});
		} else {
			// Do Nothing
		}
	};

	handleCancel() {
		this.props.history.goBack();
	}
	handleAddInstanceClick() {
		let url = "/orgs/" + this.state.org_id + "/" + this.state.channel_title + "/new";
		this.props.history.push(url);
	}
	//Opens ChannelInstanceListComponent at the given channel and instance
	handleInstanceClick(instance_title, e) {
		e.preventDefault();
		var url = "/orgs/" + this.state.org_id + "/channels";

		//If the current user is an admin or org owner
		let role = org_member_details.get(this.state.username).role;
		if (role === "ADMIN" || role === "ORG_OWNER") {
			//Open the chat
			this.props.history.push({
				pathname: url,
				state: {
					channel_title: this.state.channel_title,
					instance_title: instance_title,
				},
			});
		} else {
			//If the current user is in the channel
			for (var i in this.state.members) {
				if (this.state.members[i].username === this.state.username) {
					//Open the chat
					this.props.history.push({
						pathname: url,
						state: {
							channel_title: this.state.channel_title,
							instance_title: instance_title,
						},
					});
				}
			}
		}
	}

	addUser = (user) => {
		let add = [{username: user.username, role: user.value.role}];
		OrgsResources.add_users_to_channel(
			this.state.username,
			this.state.org_id,
			this.state.channel_title,
			add
		).then((response) => {
			this.loadChannel();
			this.loadOrg();
			this.setState({searched_users: [], search_key: ""});
		});
	};

	// Maps all the Searched and Pending Users
	mapNonOrgUsers(mapper, is_searched) {
		let retDiv;
		// Ensure the Array Has Data
		if (mapper.length > 0) {
			retDiv = mapper.map((usr, index) => {
				return (
					<ListGroup.Item key={index} className="bg-light text-dark">
						<div className="d-flex justify-content-between">
							<p>
								{usr.value.fname} {usr.value.lname}
							</p>
							<Button variant="success" onClick={() => this.addUser(usr)}>
								<i className="fas fa-plus"></i>
							</Button>
						</div>
					</ListGroup.Item>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}

	componentDidUpdate() {}

	componentDidMount() {
		this.loadOrg();
	}

	loadOrg() {
		OrgsResources.retrieve_org(this.state.username, this.state.org_id).then((response) => {
			this.setState({org: response.data});
			this.loadChannel();
		});
	}

	loadChannel() {
		OrgsResources.retrieve_channel(
			this.state.username,
			this.state.org_id,
			this.state.old_channel_title
		).then((response) => {
			this.setState(
				{channel: response.data, members: response.data.members},
				this.load_org_member_details()
			);
		});
	}

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

	manage_member = (username, new_role) => {
		let auth = {
			username: this.state.username,
			role: org_member_details.get(this.state.username).role,
		};
		let member = {
			username: username,
			role: org_member_details.get(username).role,
		};
		let new_managed = {
			username: username,
			role: new_role,
		};
		let body = [];
		body.push(auth);
		body.push(member);
		body.push(new_managed);
		// Push Request to Server
		OrgsResources.manage_users_in_org(this.state.org_id, body).then((response) => {
			alert("The User has been Modified");
			// Reload the Page as Alot of Modifications can Occur
			window.location.reload(false);
		});
	};

	remove_member = (username) => {
		let remove = [];
		for (var i in this.state.members) {
			if (this.state.members[i].username === username) {
				remove.push(this.state.members[i]);
				break;
			}
		}

		OrgsResources.remove_users_from_channel(
			this.state.username,
			this.state.org_id,
			this.state.old_channel_title,
			remove
		).then((response) => {
			alert("User Removed from Channel ", this.state.old_channel_title);
			this.loadChannel();
		});
	};

	load_org_member_details() {
		// Create the Map for the Member Details
		OrgsResources.retrieve_basic_users_in_orgs(this.state.org.members).then((response) => {
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
			// // Sort this.state.members to correct Heirarchy
			// this.sort_by_role();
			// // Sort this.state.channel[i].members to correct Heirarchy
			// this.sort_by_role_channels();

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

	render() {
		return (
			<div className="app-window update-org-component">
				<Container fluid>
					<Form noValidate validated={this.state.validated} className="update-org-form">
						<h1>
							Update Channel: <strong>{this.state.channel.channel_title}</strong>
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
								</Form.Group>
							</Col>
							<Col>
								<Form.Group>
									<Form.Label>Change Channel Title</Form.Label>
									<Form.Control
										type="text"
										name="title"
										id="org_title"
										value={this.state.channel_title}
										onChange={this.handle_typing_channel_title}
										placeholder="Organisation Title"
									/>

									<FormControl.Feedback type="invalid">
										{this.state.channel_title_error}
									</FormControl.Feedback>
								</Form.Group>
							</Col>
						</Row>

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
													show_manage_buttons={false}
													username={this.state.username}
													members={this.state.members}
													org_member_details={org_member_details}
													remove_member={this.remove_member}
												/>
											) : null}
										</Col>
										<Col>
											<Container
												fluid
												className="org-new-users overflow-auto">
												<Row className="org-new-users">
													<h3>Invite a user to channel</h3>
												</Row>
												<Row>
													<InputGroup>
														<input
															className="search-input org-new-users"
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
														<InputGroup.Append>
															<Button
																type="button"
																onClick={
																	this.handle_search_new_users
																}>
																<i className="fas fa-search"></i>
															</Button>
														</InputGroup.Append>
													</InputGroup>
												</Row>
												<Row>
													<ListGroup className="org-new-users">
														{this.mapNonOrgUsers(
															this.state.searched_users,
															true
														)}
													</ListGroup>
												</Row>
											</Container>
										</Col>
									</Row>
								</Container>
							</Tab>
							<Tab eventKey="instances" style={{height: "1rem"}} title="Instances">
								<Container fluid>
									<Row>
										<Col>
											<h3>Instances</h3>
										</Col>
										<Col md={1}>
											<OverlayTrigger delay={{ show: 400, hide: 0 }}
												delay={{ show: 400, hide: 0 }}
												placement="left"
												overlay={<Tooltip>New Instance</Tooltip>}>
												<Button
													variant="outline-dark"
													onClick={this.handleAddInstanceClick}>
													<i className="fas fa-plus"></i>
												</Button>
											</OverlayTrigger>
										</Col>
									</Row>
									<Row>
										<Col>
											<ListGroup>
												{this.state.channel.instances.map((instance) => (
													<ListGroup.Item
														onClick={(e) =>
															this.handleInstanceClick(
																instance.instance_title,
																e
															)
														}
														action>
														{instance.instance_title}
													</ListGroup.Item>
												))}
											</ListGroup>
										</Col>
									</Row>
								</Container>
							</Tab>
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
									Update Channel
								</Button>
							</Form.Group>
						</Row>
					</Form>
				</Container>
			</div>
		);
	}
}

export default UpdateChannelsComponent;
