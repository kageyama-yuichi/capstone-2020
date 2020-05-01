import React, {Component} from "react";
import OrgsResources from "./OrgsResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./OrgsComponent.css";
import { Link } from "react-router-dom";
import tempImg from "../../assests/orgImg.svg";

import {Button, ButtonGroup, Container, Row, Col, Card, CardDeck} from "react-bootstrap";

/*
	Left to do:
	Display the Delete Button Only for ORG_OWNER
	Display the Update Button Only for ORG_OWNER and ADMIN
*/

class OrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgs: [],
		};
		this.handle_create_org = this.handle_create_org.bind(this);
		this.handle_update_org = this.handle_update_org.bind(this);
		this.handle_delete_org = this.handle_delete_org.bind(this);
	}

	handle_goto_channel = (org_id) => {
		var url = this.props.history.location.pathname + "/" + org_id + "/channels";
		this.props.history.push(url);
	};
	// Function to Send the User to the Create Organisation Screen
	handle_create_org() {
		this.props.history.push("/orgs/new");
	}
	// Function to Delete the Organisation that the User has Clicked
	handle_delete_org = (org_id) => {
		OrgsResources.delete_org(this.state.username, org_id).then((response) => {
			// Reset using this.refresh_orgs in Callback to Force
			this.setState(
				{
					orgs: [],
				},
				() => {
					this.refresh_orgs();
				}
			);
		});
	};
	// Function to Update the Organisation that the User clicked
	handle_update_org = (org_id) => {
		var url = this.props.history.location.pathname + "/" + org_id;
		this.props.history.push(url);
	};

	componentDidUpdate() {
		console.log(this.state.orgs);
	}

	refresh_orgs = () => {
		// Retrieves the Organisations of the User from the Server
		OrgsResources.retrieve_orgs(this.state.username).then((response) => {
			// Maps the Response Data (Orgs.class) to JSObject
			for (let i = 0; i < response.data.length; i++) {
				var user_role_temp = "";
				// Find the User's Role
				for (let j = 0; j < response.data[i].members.length; j++) {
					if (response.data[i].members[j].username === this.state.username) {
						user_role_temp = response.data[i].members[j].role;
						break;
					}
				}
				this.state.orgs.push({
					org_id: response.data[i].org_id,
					org_title: response.data[i].org_title,
					user_role: user_role_temp,
					members: response.data[i].members,
				});
				this.setState({
					orgs: this.state.orgs,
				});
			}

			// this.state.orgs.push({
			// 	org_id: "testorg1",
			// 	org_title: "This is a text org when user is an admin",
			// 	user_role: "ADMIN",
			// 	members: []
			// })
			// this.state.orgs.push({
			// 	org_id: "testorg2",
			// 	org_title: "This is a text org when user is a USER",
			// 	user_role: "USER",
			// 	members: []
			// })
			// this.setState({
			// 	orgs: this.state.orgs
			// })
		});
	};

	componentDidMount() {
		this.refresh_orgs();
	}

	renderButtons(org) {
		if (org.user_role === "ORG_OWNER") {
			console.log("calling render for org owner");
			return (
				<Card.Footer>
					<ButtonGroup>
						<Button onClick={() => this.handle_update_org(org.org_id)} variant="dark">Edit</Button>
						<Button onClick={() => this.handle_delete_org(org.org_id)} variant="danger">Delete</Button>
					</ButtonGroup>
				</Card.Footer>
			);
		} else if (org.user_role === "ADMIN") {
			return (
				<Card.Footer>
					<ButtonGroup>
						<Button onClick={() => this.handle_update_org(org.org_id)} variant="dark">Edit</Button>
					</ButtonGroup>
				</Card.Footer>
			);
		} else {
			return;
		}
	}

	render() {
		return (
			<div className="app-window org-component">
				<Container fluid className="h-100">
					<Row
						style={{height: "fit-content"}}
						className="header-title border-bottom mb-3 align-items-center">
						<Col style={{height: "fit-content"}}>
							<h1>Organisations</h1>
						</Col>
						<Col  md={1} sm={3} style={{height: "fit-content"}}>
							<Button style={{whiteSpace: "nowrap"}} variant="primary" onClick={this.handle_create_org}>New org</Button>
						</Col>
					</Row>
					<CardDeck className="window-body" style={{height: "auto", overflowY: "scroll"}}>
						{this.state.orgs.map((org) => (
							<Card className="org-card" key={org.org_id}>
								<Link to={"orgs/" + org.org_id + "/channels"} className="cards-fix">
									<Card.Img variant="top" width="20rem" height="140px"src={tempImg} />
									<Card.Body>
										<Card.Title>{org.org_title}</Card.Title>
									</Card.Body>
								</Link>

								{this.renderButtons(org)}
							</Card>
						))}
					</CardDeck>
				</Container>
			</div>
			
		);
	}
}

export default OrgsComponent;
