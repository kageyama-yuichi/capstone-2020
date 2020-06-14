import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import "../OrgsComponent.css";
import {Container, Button, ButtonGroup, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

class RemoveUserFromChannelComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			value: [],
		};
		this.mapOrgUsers = this.mapOrgUsers.bind(this);
		this.onChange = this.onChange.bind(this);
		this.removeTheUsersFromChannel = this.removeTheUsersFromChannel.bind(this);
	}

	onChange = (value) => {
		this.setState({value});
	};

	removeTheUsersFromChannel = () => {
		let removed_users_from_channel = [];
		// Go through this.props.current_members_in_channel and get the Role and Push
		for (let i = 0; i < this.props.current_members_in_channel.length; i++) {
			for (let j = 0; j < this.state.value.length; j++) {
				// if they are in the Value, Push
				if (this.props.current_members_in_channel[i].username === this.state.value[j]) {
					removed_users_from_channel.push(this.props.current_members_in_channel[i]);
				}
			}
		}
		OrgsResources.remove_users_from_channel(
			this.state.username,
			this.props.org_id,
			this.props.channel_title,
			removed_users_from_channel
		).then((response) => {
			alert("Users Removed from Channel ", this.props.channel_title);
			// Exit the Window and Refresh Page
			window.location.reload(false);
		});
	};

	setSelected = (username, role) => {
		var ret = "light";

		if (role === "ORG_OWNER") {
			ret = "danger";
		} else if (role === "ADMIN") {
			ret = "warning";
		} else if (role === "TEAM_LEADER") {
			ret = "info";
		}

		for (let i = 0; i < this.state.value.length; i++) {
			if (username === this.state.value[i]) {
				ret = "success";
			}
		}

		return ret;
	};

	// Maps all the OrgUsers
	mapOrgUsers() {
		let retDiv;

		retDiv = this.props.current_members_in_channel.map((member) => {
			return (
				<ToggleButton
					key={member.username}
					value={member.username}
					variant={this.setSelected(member.username, member.role)}
					size="lg">
					{this.props.org_member_details.get(member.username).name}
				</ToggleButton>
			);
		});

		return retDiv;
	}

	render() {
		return (
			<div className="wrapper">
				<div className="bg" onClick={this.props.handler}></div>

				<div className="overlay" style={{width: "600px", height: "500px"}}>
					<Container className="h-100 pt-5 pb-5 w-75 d-flex  justify-content-between align-items-center flex-column">
						<div className="d-flex flex-column align-items-center">
							<h1>Remove Users from {this.props.channel_title}</h1>

							<ToggleButtonGroup
								className="overflow-auto"
								type="checkbox"
								value={this.state.value}
								onChange={this.onChange}
								vertical>
								{this.mapOrgUsers()}
							</ToggleButtonGroup>
						</div>

						<ButtonGroup>
							<Button
								onClick={this.props.handler}
								className="mt-auto"
								variant="secondary">
								Cancel
							</Button>
							<Button
								onClick={() => this.removeTheUsersFromChannel()}
								className="mt-auto"
								variant="primary">
								Remove Users
							</Button>
						</ButtonGroup>
					</Container>
				</div>
			</div>
		);
	}
}

export default RemoveUserFromChannelComponent;
