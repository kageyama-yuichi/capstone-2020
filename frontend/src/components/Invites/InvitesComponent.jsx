import React, {Component} from "react";
import InvitesResources from "./InvitesResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./InvitesComponent.css";
import {withRouter} from "react-router-dom";
import {Button, ButtonGroup, Container, ListGroup} from "react-bootstrap";

const inviter_details = new Map();
var invites = [];
var accepted = "TRUE";
var rejected = "FALSE";

class InvitesComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
		};
		this.loadInviterDetails = this.loadInviterDetails.bind(this);
		this.handleAcceptInvite = this.handleAcceptInvite.bind(this);
		this.handleRejectInvite = this.handleRejectInvite.bind(this);
	}

	// Function to Update the Organisation that the User clicked
	handleAcceptInvite = (unique_id) => {
		InvitesResources.user_decision_on_invite(unique_id, accepted).then((response) => {
			// Redirect the User to the Orgs Tap
			this.props.history.push("/orgs");
		});
	};
	// Function to Allow the User to Reject an Organisational Invite
	handleRejectInvite = (unique_id) => {
		InvitesResources.user_decision_on_invite(unique_id, rejected).then((response) => {
			this.refreshInvites();
		});
	};

	refreshInvites = () => {
		InvitesResources.retrieve_pending_invites_for_user(this.state.username)
			.then((response) => {
				// Set all the Invites
				invites = response.data;
			})
			.then(() => {
				this.loadInviterDetails();
			});
	};

	loadInviterDetails() {
		// Get the Basic User of the Inviter
		var inviter_usernames = [];
		// Get all the Inviter Usernames
		for (let i = 0; i < invites.length; i++) {
			inviter_usernames.push(invites[i].inviter);
		}
		var temp_response = [];
		InvitesResources.retrieve_basic_user(inviter_usernames)
			.then((response) => {
				temp_response = response.data;
			})
			.then(() => {
				for (let i = 0; i < temp_response.length; i++) {
					let temp_basic_user = {
						name: temp_response[i].fname + " " + temp_response[i].lname,
						bio: temp_response[i].bio,
						imagePath: temp_response[i].imagePath,
					};
					inviter_details.set(inviter_usernames[i], temp_basic_user);
				}
				this.forceUpdate();
			});
	}

	componentDidMount() {
		this.refreshInvites();
	}

	renderButtons(org) {}

	mapInvites = () => {
		let retDiv;
		// Ensure the Array Has Data
		if (invites.length > 0 && inviter_details.size > 0) {
			retDiv = invites.map((inv) => {
				return (
					<ListGroup.Item key={inv.uniqueId} className="invites bg-light text-dark">
						<div className="d-flex justify-content-between">
							<p>
								{inviter_details.get(inv.inviter).name} invites you to{" "}
								<strong>{inv.orgId}</strong>
							</p>
							<ButtonGroup className="align-self-end">
								<Button
									key={inv.uniqueId + "accept"}
									variant="success"
									onClick={() => this.handleAcceptInvite(inv.uniqueId)}>
									<i className="fas fa-check"></i>
								</Button>
								<Button
									key={inv.uniqueId + "decline"}
									variant="danger"
									onClick={() => this.handleRejectInvite(inv.uniqueId)}>
									<i className="fas fa-times"></i>
								</Button>
							</ButtonGroup>
						</div>
					</ListGroup.Item>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	};

	render() {
		return (
			<div className="invites-component">
				<Container fluid style={{overflowY: "auto"}}>
					{invites.length > 0 ? (
						<ListGroup className="overflow-auto">{this.mapInvites()}</ListGroup>
					) : (
						<p>You have no pending requests.</p>
					)}
				</Container>
			</div>
		);
	}
}

export default withRouter(InvitesComponent);
