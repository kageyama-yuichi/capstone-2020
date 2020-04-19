import React, {Component} from "react";
import OrgsResources from "./OrgsResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./UpdateOrgsComponent.css";

import {Container, Form, Button, ButtonGroup, Row, Col, ListGroup, Collapse} from "react-bootstrap";

/*
	Left to do:
	Work out how to Delete Members
	Work out how to Delete Channels
	Work out how to Invite Members Here
	Work out how to Update a Member Role
	Fix all the this.on_submit() validation
*/

class UpdateOrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			old_org_id: this.props.match.params.org_id,
			org_title: "",
			channels: [],
			members: [],
			org: [],
			owned_ids: [],
			memberListOpen: [],
			errors: [],
		};
		this.on_submit = this.on_submit.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleValidation(e) {
		
		var formIsValid = true;
		var str2 = new String(this.state.org_id);
		var errors = new Object();
		if (this.state.org_id.length < 3 || this.state.org_id === "new") {
			errors.id = "Org ID is too short";
			formIsValid = false;
		} else {
			// Check if the ID Exists
			for (let i = 0; i < this.state.owned_ids.length; i++) {
				var str1 = new String(this.state.owned_ids[i].org_id);
				// Compare the String Values
				if (str1.valueOf() == str2.valueOf()) {
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
				channels: this.state.channels,
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
	handle_typing_org_id = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			org_id: event.target.value
				.toLowerCase()
				.trim()
				.replace(/[^\w\s]/gi, ""),
			error: false,
		});
	};
	handle_typing_org_title = (event) => {
		this.setState({
			org_title: event.target.value,
			error: false,
		});
	};

	handle_create_channel = () => {
		var url = this.props.history.location.pathname + "/new";
		this.props.history.push(url);
	};
	handle_delete_channel = (channel_title) => {
		console.log("Deleteing");
		OrgsResources.delete_channel(this.state.username, this.state.org_id, channel_title).then(
			(response) => {
				console.log("Deleted");
				this.setState(
					{
						channels: [],
					},
					() => {
						// Retrieves All Channels from the Org Data
						OrgsResources.retrieve_org(this.state.username, this.state.old_org_id).then(
							(response) => {
								this.setState({
									channels: response.data.channels,
								});
							}
						);
					}
				);
			}
		);
	};
	handle_update_channel = (channel_title) => {
		var url = this.props.history.location.pathname + "/" + channel_title;
		this.props.history.push(url);
	};

	handleCancel() {
		this.props.history.goBack();
	}

	componentDidUpdate() {
		// console.log(this.state.org_id);
		// console.log(this.state.org_title);
		// console.log(this.state.channels);
		// console.log(this.state.members);
	}

	componentDidMount() {
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				// They Can Claim the Same ID
				if (this.state.org_id != response.data[i]) {
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
			this.setState(
				{
					org_id: response.data.org_id,
					org_title: response.data.org_title,
					channels: response.data.channels,
					members: response.data.members,
				},
				() => {
					//Initializing member list dropdown
					this.state.channels.map((channel) => {
						console.log(channel.channel_title);
						this.state.memberListOpen[channel.channel_title] = false;
					});

					this.setState({memberListOpen: this.state.memberListOpen});
					console.log(this.state.memberListOpen);
				}
			);
		});
	}

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

	render() {
		console.log("System - Rendering Page...");
		return (
			<div className="app-window update-org-component">
				<Container fluid>
					<Form
						noValidate
						validated={this.state.validated}
						onSubmit={this.on_submit.bind(this)}
						className="update-org-form">
						<h1>Update: {this.state.org_title}</h1>
						<Row>
							<Col>
								<Form.Group>
									<Form.Label>Change Org ID</Form.Label>
									<Form.Control
										type="text"
										name="id"
										id="org_id"
										value={this.state.org_id}
										onChange={this.handle_typing_org_id}
										placeholder="Organisation ID"
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
										<Col>
											<h3>Member List</h3>
										</Col>
										<Col md={1}>
											<Button
												variant="outline-dark"
											>
												<i className="fas fa-plus"></i>
											</Button>
										</Col>
									</Row>

									<ListGroup className="overflow-auto">
										{this.state.members.map((member) => {
											// {console.log(this.setRoleClassName(member.role))}
											return (
												<ListGroup.Item
													key={member.username}
													variant={this.setRoleStyling(member.role)}>
													{member.username}
												</ListGroup.Item>
											);
										})}
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
												{this.state.channels.map((ch) => (
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
																		<i class="fas fa-angle-up"></i>
																	) : (
																		<i className="fas fa-caret-down"></i>
																	)}
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
															{ch.members.map((member) => {
																return (
																	<ListGroup.Item
																		key={member.username}
																		variant={this.setRoleStyling(
																			member.role
																		)}>
																		{member.username}
																	</ListGroup.Item>
																);
															})}
														</ListGroup>
													</ListGroup.Item>
												))}
											</ListGroup>
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
									Cancel
								</Button>
							</Form.Group>
							<Form.Group md="2" as={Col}>
								<Button
									id="org_update"
									type="submit"
									variant="secondary"
									style={{whiteSpace: "nowrap"}}
									>
									Update Organisation
								</Button>
							</Form.Group>
						</Row>
					</Form>
				</Container>
			</div>
		);
	}
}

export default UpdateOrgsComponent;
