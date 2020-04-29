import React, {Component} from "react";
import InvitesResources from "./InvitesResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./InvitesComponent.css";

import {Button, ButtonGroup, Container, Row, Col, ListGroup} from "react-bootstrap";

const inviter_details = new Map();
var invites = [];

class InvitesComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
		};
		this.load_inviter_details = this.load_inviter_details.bind(this);
		this.handle_accept_invite = this.handle_accept_invite.bind(this);
		this.handle_reject_invite = this.handle_reject_invite.bind(this);
	}

	// Function to Update the Organisation that the User clicked
	handle_accept_invite = (unique_id) => {
		console.log("Accept");
	};
	// Function to Allow the User to Reject an Organisational Invite
	handle_reject_invite = (unique_id) => {
		console.log("Reject");
	};

	componentDidUpdate() {
	}

	refresh_invites = () => {
		InvitesResources.retrieve_pending_invites_for_user(this.state.username).then((response) => {
			// Set all the Invites
			invites = response.data;
		}).then( 
			() => {
				this.load_inviter_details();
			}
		);
	};

	load_inviter_details() {
		// Get the Basic User of the Inviter
		var inviter_usernames = [];
		// Get all the Inviter Usernames
		for(let i=0; i<invites.length; i++){
			inviter_usernames.push(invites[i].inviter);
		}
		var temp_response = [];
		InvitesResources.retrieve_basic_user(inviter_usernames).then((response) => {
			temp_response = response.data;
		}).then(
			() => {
				for(let i=0; i<temp_response.length; i++){
					let temp_basic_user = {
						name: temp_response[i].fname+" "+temp_response[i].lname,
						bio: temp_response[i].bio,
						imagePath: temp_response[i].imagePath
					}
					inviter_details.set(inviter_usernames[i], temp_basic_user);
				}
				this.forceUpdate();
			}
		);
	};
	
	componentDidMount() {
		this.refresh_invites();
	}

	renderButtons(org) {
	}

	mapInvites = () => {
		let retDiv;
		// Ensure the Array Has Data
		if(invites.length > 0 && inviter_details.size > 0) {
			retDiv = invites.map((inv) => {
				let temp_inviter = inviter_details.get(inv.inviter);
				console.log(inviter_details);
				return (
				<>	
					<Row>
						<Col sm={9}>
							<ListGroup.Item
								key={inv.uniqueId}
								variant="light">
								{inviter_details.get(inv.inviter).name} invites you to <strong>{inv.orgId}</strong>
							</ListGroup.Item>
						</Col>
						<Col sm={1}>
							<ButtonGroup>
								<Button
									key={inv.uniqueId+"accept"}
									variant="success"
									onClick={() => this.handle_accept_invite(inv.uniqueId)}>
									<i className="fas fa-check"></i>
								</Button>
								<Button
									key={inv.uniqueId+"decline"}
									variant="danger"
									onClick={() => this.handle_reject_invite(inv.uniqueId)}>
									<i className="fas fa-times"></i>
								</Button>
							</ButtonGroup>
						</Col>
					</Row>
				</>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	};
	
	render() {
		return (
			<div>
				<Container fluid className="h-100">
					<ListGroup>
						{this.mapInvites()}
					</ListGroup>
				</Container>
			</div>
			
		);
	}
}

export default InvitesComponent;
