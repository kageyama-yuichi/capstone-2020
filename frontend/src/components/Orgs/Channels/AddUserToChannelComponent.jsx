import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import "../OrgsComponent.css";
import {
	Container,
	Button,
	ButtonGroup,
	ToggleButton,
	ToggleButtonGroup,

} from "react-bootstrap";

var member_difference = [];

class AddUserToChannelComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			value: [],
		};
		this.mapOrgUsers = this.mapOrgUsers.bind(this);
		this.onChange = this.onChange.bind(this);
		this.add_users_to_channel = this.add_users_to_channel.bind(this);
	}

	onChange = (value) => {
		this.setState({value});
	};

	add_users_to_channel = () => {
		let new_users_to_channels = [];
		// Go through this.props.members and get the Role and Push
		for (let i = 0; i < this.props.members.length; i++) {
			for (let j = 0; j < this.state.value.length; j++) {
				// if they are in the Value, Push
				if (this.props.members[i].username === this.state.value[j]) {
					new_users_to_channels.push(this.props.members[i]);
				}
			}
		}
		OrgsResources.add_users_to_channel(
			this.state.username,
			this.props.org_id,
			this.props.channel_title,
			new_users_to_channels
		).then((response) => {
			alert("Users Added to Channel ", this.props.channel_title);
			// Exit the Window and Refresh Page
			window.location.reload(false);
		});
	};

	componentDidMount() {
		// Make a Temporary Map
		const temp_map = new Map([...this.props.org_member_details.entries()]);
		// Reset the Array for Consistency
		member_difference = [];

		// Calculate the Member Difference
		for (let i = 0; i < this.props.current_members_in_channel.length; i++) {
			if (temp_map.has(this.props.current_members_in_channel[i].username)) {
				temp_map.delete(this.props.current_members_in_channel[i].username);
			}
		}
		// Linear Map to Variable with Sorting Already Completed
		for (let i = 0; i < this.props.members.length; i++) {
			if (temp_map.has(this.props.members[i].username)) {
				member_difference.push(this.props.members[i]);
			}
		}
		this.forceUpdate();
	}

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

		retDiv = member_difference.map((member) => {
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

				<div className="overlay" style={{height: "500px", width: "600px"}}>
					<Container className="h-100 p-1 d-flex  justify-content-between align-items-center flex-column">
						<div className="d-flex flex-column align-items-center">
							<h1>Add Users to {this.props.channel_title}</h1>

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
							<Button onClick={() => this.add_users_to_channel()} variant="primary">
								Add Users
							</Button>
						</ButtonGroup>
					</Container>
				</div>
			</div>
		);
	}
}

export default AddUserToChannelComponent;
