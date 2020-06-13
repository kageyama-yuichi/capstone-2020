import React, {Component} from "react";
import OrgsResources from "./OrgsResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./OrgsComponent.css";
import {Link} from "react-router-dom";
import tempImg from "../../assests/orgImg.svg";

import {Button, Card, CardDeck, Container} from "react-bootstrap";


class OrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgs: [],
		};
		this.handle_create_org = this.handle_create_org.bind(this);
		this.handle_update_org = this.handle_update_org.bind(this);
	}

	handle_goto_channel = (org_id) => {
		var url = this.props.history.location.pathname + "/" + org_id + "/channels";
		this.props.history.push(url);
	};
	// Function to Send the User to the Create Organisation Screen
	handle_create_org() {
		this.props.history.push("/orgs/new");
	}

	// Function to Update the Organisation that the User clicked
	handle_update_org = (org_id) => {
		var url = this.props.history.location.pathname + "/" + org_id;
		this.props.history.push(url);
	};

	componentDidUpdate() {
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

		});
	};

	componentDidMount() {
		this.refresh_orgs();
	}

	renderButtons(org) {
		if (org.user_role === "ORG_OWNER" || org.user_role === "ADMIN") {
			return (
				<Card.Footer>
					<Button onClick={() => this.handle_update_org(org.org_id)} variant="info">
						Edit
					</Button>
				</Card.Footer>
			);
		}
		return;
	}

	render() {
		return (
			<div className="app-window org-component">
				<Container fluid className="h-100">
					<div
						style={{height: "fit-content"}}
						className="d-flex justify-content-between header-title border-bottom mb-3 align-items-center">
						<h1>Organisations</h1>

						<Button
							style={{whiteSpace: "nowrap"}}
							variant="primary"
							onClick={this.handle_create_org}>
							New org
						</Button>
					</div>
					<CardDeck className="window-body" style={{height: "auto", overflowY: "auto"}}>
						{this.state.orgs.map((org) => (
							<Card className="org-card mb-1" key={org.org_id}>
								<Link to={"orgs/" + org.org_id + "/channels"} className="unselectable cards-fix">
									<Card.Img 
										className="unselectable"
										variant="top"
										width="20rem"
										height="140px"
										src={tempImg}
									/>
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
