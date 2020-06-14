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
	Tooltip,
	Toast,
} from "react-bootstrap";
import MemberListComponent from "../UpdateOrgs/MemberListComponent";

const orgMemberDetails = new Map();

class UpdateChannelsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			channel: props.location.state.channel,
			channelTitle: props.match.params.channel_title,
			oldChannelTitle: props.match.params.channel_title,
			orgId: props.match.params.org_id,
			org: null,
			channelTitleError: "",
			ownedIds: [],
			memberDetailsLoaded: false,
			members: props.location.state.channel.members,
			isVerifed: false,
			searchKey: "",
			searchedUsers: [],
			alerts: [],
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleAddInstanceClick = this.handleAddInstanceClick.bind(this);
		this.handleInstanceDelete = this.handleInstanceDelete.bind(this);
	}

	onSubmit = (e) => {
		e.preventDefault();
		e.stopPropagation();
		var internal_error = false;
		var error = "";

		// Ensure Length is 3 or Greater
		if (this.state.channelTitle.length < 3 || this.state.channelTitle === "new") {
			error = "Channel title too short";
			internal_error = true;
		} else if (this.state.channelTitle.length > 100) {
			// Max length 100
			error = "Channel title too long";
			internal_error = true;
		}

		if (!internal_error) {
			// Check if the ID Exists
			OrgsResources.validateChannelTitle(
				this.state.username,
				this.state.orgId,
				this.state.oldChannelTitle,
				this.state.channelTitle
			).then((response) => {
				if (!response.data) {
					error = "ID already used";
					this.setState({
						channelTitleError: true,
					});
				} else {
					let channel = this.state.channel;
					channel.channel_title = this.state.channelTitle;
					OrgsResources.update_channel(
						this.state.username,
						this.state.orgId,
						this.state.oldChannelTitle,
						channel
					).then(() => this.props.history.goBack());
				}
			});
		}

		if (error.length > 0) {
			document.getElementById("org_title").setCustomValidity("invalid");
		}

		this.setState({channelTitleError: error, validated: true});
	};

	handleTypingChannelTitle = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			channelTitle: event.target.value,
			channelTitleError: false,
		});
	};

	handleTypingSearchKey = (event) => {
		this.setState({
			searchKey: event.target.value.replace(/[^a-zA-Z ']/gi, ""),
		});
	};

	//Searches for members that are not in the channel but in the org
	handleSearchNewUsers = () => {
		if (this.state.searchKey !== "") {
			// Search for the Users Specified and Update Area

			// Assign the Searched Users that Are Not in the Org to the Array
			var searched_users = [];
			var search_key = this.state.searchKey.toLowerCase();
			var filtered = new Map(orgMemberDetails);
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

			this.setState({searchedUsers: searched_users});
		} else {
			// Do Nothing
		}
	};

	handleCancel() {
		this.props.history.goBack();
	}
	handleAddInstanceClick() {
		let url = "/orgs/" + this.state.orgId + "/" + this.state.channelTitle + "/new";
		this.props.history.push(url);
	}
	//Opens ChannelInstanceListComponent at the given channel and instance
	handleInstanceClick(instance_title, e) {
		e.preventDefault();
		var url = "/orgs/" + this.state.orgId + "/channels";

		//If the current user is an admin or org owner
		let role = orgMemberDetails.get(this.state.username).role;
		if (role === "ADMIN" || role === "ORG_OWNER") {
			//Open the chat
			this.props.history.push({
				pathname: url,
				state: {
					channel_title: this.state.channelTitle,
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
							channel_title: this.state.channelTitle,
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
			this.state.orgId,
			this.state.channelTitle,
			add
		).then((response) => {
			this.loadChannel();
			this.loadOrg();
			this.setState({searchedUsers: [], search_key: ""});
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

	componentDidMount() {
		this.loadOrg();
	}

	loadOrg() {
		OrgsResources.retrieve_org(this.state.username, this.state.orgId).then((response) => {
			this.setState({org: response.data});
			this.loadChannel();
		});
	}

	loadChannel() {
		OrgsResources.retrieve_channel(
			this.state.username,
			this.state.orgId,
			this.state.oldChannelTitle
		).then((response) => {
			this.setState(
				{channel: response.data, members: response.data.members},
				this.loadOrgMemberDetails()
			);
		});
	}

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

	manageMember = (username, new_role) => {
		let auth = {
			username: this.state.username,
			role: orgMemberDetails.get(this.state.username).role,
		};
		let member = {
			username: username,
			role: orgMemberDetails.get(username).role,
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
		OrgsResources.manage_users_in_org(this.state.orgId, body).then((response) => {
			alert("The User has been Modified");
			// Reload the Page as Alot of Modifications can Occur
			window.location.reload(false);
		});
	};

	removeMember = (username) => {
		let remove = [];
		for (var i in this.state.members) {
			if (this.state.members[i].username === username) {
				remove.push(this.state.members[i]);
				break;
			}
		}

		OrgsResources.remove_users_from_channel(
			this.state.username,
			this.state.orgId,
			this.state.oldChannelTitle,
			remove
		).then((response) => {
			this.setState((prevState) => ({
				alerts: [...prevState.alerts, `Channel ${username} successfully removed`],
			}));
			this.loadChannel();
		});
	};

	loadOrgMemberDetails() {
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
				orgMemberDetails.set(response.data[i].username, user_details);
			}
			this.setState({
				memberDetailsLoaded: true,
			});

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

	handleInstanceDelete(instance_title) {
		OrgsResources.delete_instance(
			this.state.username,
			this.state.orgId,
			this.state.channelTitle,
			instance_title
		).then(() => {
			this.setState((prevState) => ({
				alerts: [...prevState.alerts, `Instance ${instance_title} successfully removed`],
			}));
			this.loadChannel();
		});
	}

	render() {
		return (
			<div className="app-window update-org-component">
				<Container fluid>
					<Form
						noValidate
						validated={this.state.validated}
						onSubmit={(e) => {
							e.preventDefault();
						}}
						className="update-org-form">
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
										value={this.state.orgId}
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
										value={this.state.channelTitle}
										onChange={this.handleTypingChannelTitle}
										placeholder="Organisation Title"
									/>

									<FormControl.Feedback type="invalid">
										{this.state.channelTitleError}
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
											orgMemberDetails.size > 0 ? (
												<MemberListComponent
													show_buttons={true}
													show_manage_buttons={false}
													username={this.state.username}
													members={this.state.members}
													org_member_details={orgMemberDetails}
													remove_member={this.removeMember}
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
															value={this.state.searchKey}
															onChange={this.handleTypingSearchKey}
															placeholder="Enter the Name of the User"
															onKeyPress={(event) => {
																if (event.key === "Enter") {
																	this.handleSearchNewUsers();
																}
															}}
														/>
														<InputGroup.Append>
															<Button
																type="button"
																onClick={this.handleSearchNewUsers}>
																<i className="fas fa-search"></i>
															</Button>
														</InputGroup.Append>
													</InputGroup>
												</Row>
												<Row>
													<ListGroup className="org-new-users">
														{this.mapNonOrgUsers(
															this.state.searchedUsers,
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
											<OverlayTrigger
												delay={{show: 400, hide: 0}}
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
														<div className="d-flex justify-content-between">
															{instance.instance_title}
															<OverlayTrigger
																delay={{show: 400, hide: 0}}
																key={
																	instance.instance_title +
																	"remove"
																}
																placement="bottom"
																overlay={<Tooltip>Remove</Tooltip>}>
																<Button
																	type="button"
																	variant="danger"
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();

																		this.handleInstanceDelete(
																			instance.instance_title
																		);
																	}}>
																	<i className="fas fa-times"></i>
																</Button>
															</OverlayTrigger>
														</div>
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
									onClick={() => this.onSubmit.bind(this)}>
									Update Channel
								</Button>
							</Form.Group>
						</Row>
					</Form>
				</Container>
				{this.mapToastAlerts()}
			</div>
		);
	}
}

export default UpdateChannelsComponent;
