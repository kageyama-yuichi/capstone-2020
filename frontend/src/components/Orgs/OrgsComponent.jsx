import React, {Component} from "react";
import OrgsResources from "./OrgsResources.js";
import {API_URL} from "../../Constants";
import "./OrgsComponent.css";
import { Link} from "react-router-dom";


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
		});
	};

	componentDidMount() {
		this.refresh_orgs();
	}

	render() {
		return (
			<div className="app-window org-component">
				<header className="title-container">
					<div className="title-flex">
						<div className="title-div">Organisations</div>
						<Link to="/orgs/new" className="new-org-button">
							
							Create Org
						</Link>
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
				))}
			</div>
		);
	}
}

export default OrgsComponent;
