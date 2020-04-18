import React, {Component} from "react";
import OrgsResources from "./OrgsResources.js";
import {API_URL} from "../../Constants";
import "./OrgsComponent.css";

import tempImg from "../../assests/tempImg.svg";

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
			username: localStorage.getItem("username"),
			orgs: [],
		};
		this.handle_delete_org = this.handle_delete_org.bind(this);
		this.handleCreateClick = this.handleCreateClick.bind(this);
	}

	handle_delete_org = (org_id) => {
		OrgsResources.delete_org(this.state.username, org_id);
		// Reset using this.refresh_orgs in Callback to Force
		this.setState(
			{
				orgs: [],
			},
			() => {
				this.refresh_orgs();
			}
		);
	};
	handle_update_org = (org_id) => {
		var url = this.state.username + "/" + org_id;
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

	handleCreateClick() {
		this.props.history.push("/orgs/new");
	}

	componentDidMount() {
		this.refresh_orgs();
	}

	renderButtons(user_role) {
		if (user_role == "ORG_OWNER") {
			console.log("calling render for org owner");
			return (
				<Card.Footer>
					<ButtonGroup>
						<Button>Edit</Button>
						<Button variant="danger">Delete</Button>
					</ButtonGroup>
				</Card.Footer>
			);
		} else if (user_role == "ADMIN") {
			return (
				<Card.Footer>
					<ButtonGroup>
						<Button>Edit</Button>
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
				<Container fluid>
					<Row style={{height: "fit-content"}} className="border-bottom mb-3 align-items-center">
						<Col style={{height: "fit-content"}}>
							<h1>Organisations</h1>
						</Col>
						<Col md={2} style={{height: "fit-content"}}>
							<Button variant="primary" onClick={this.handleCreateClick}>
								New org
							</Button>
						</Col>
					</Row>
					<CardDeck style={{height: "auto"}}>
						{this.state.orgs.map((org) => (
							<Card style={{width: "20rem", flex: "initial"}} key={org.org_id}>
								<Card.Img variant="top" src={tempImg} />
								<Card.Body>
									<Card.Title>{org.org_title}</Card.Title>
								</Card.Body>
								{this.renderButtons(org.user_role)}
							</Card>
						))}
					</CardDeck>
				</Container>
			</div>
			/*{ <header className="title-container">
					<div className="title-flex">
						<div className="title-div">Organisations</div>
						<Button onClick={this.handleCreateClick}>
							Create a new org
						</Button>
					</div>
				</header>

				{this.state.orgs.map((org) => (
					<div key={org.org_id} className="orgs">
						<input
							className="delete_organisation"
							type="button"
							value="-"
							onClick={() => this.handle_delete_org(org.org_id)}
						/>
						<input
							className="update_organisation"
							type="button"
							value="#"
							onClick={() => this.handle_update_org(org.org_id)}
						/>
						<h3 key={org.org_id}>{org.org_title}</h3>
						<div>
							{org.members.map((member) => (
								<p key={member.username}>{member.username}</p>
							))}
						</div>
					</div>
				))} }*/
		);
	}
}

export default OrgsComponent;
