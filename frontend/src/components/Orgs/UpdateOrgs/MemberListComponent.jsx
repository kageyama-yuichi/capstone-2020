import React, {Component} from "react";
import {ListGroup, Button, ButtonGroup} from "react-bootstrap";
import {getRoleIconClassName} from "../OrgHelpers.js";

var org_member_details = new Map();

class MemberListComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username,
			members: props.members,
		};
		org_member_details = new Map(props.org_member_details);
	}

	mapOrgUsers(mapper, show_buttons) {
		let retDiv;
		// Ensure the Map Has Data
		if (org_member_details.size > 0) {
			retDiv = mapper.map((member) => {
				return (
					<ListGroup.Item key={member.username} className="bg-light text-dark">
						<div className="d-flex justify-content-between">
							<p>
								{org_member_details.get(member.username).name}{" "}
								{member.role === "TEAM_MEMBER" ? null : (
									<i className={getRoleIconClassName(member.role)}> </i>
								)}
							</p>
							{show_buttons
								? this.mapOrgMemberButtons(member.username, member.role)
								: null}
						</div>
					</ListGroup.Item>
				);
			});
		} else {
			retDiv = null;
		}
		return retDiv;
	}
	manage_member(username, role) {
		this.props.manage_member(username, role);
	}
	remove_member(username) {
		this.props.remove_member(username);
	}
	// Maps all the Member Buttons for Promoting, Demoting and Removing
	mapOrgMemberButtons(username, role) {
		let ret = [];

		//Set to null if show_manage_buttons prop is false
		let demote = this.props.show_manage_buttons ? (
			<Button
				key={username + "demote"}
				variant="warning"
				onClick={() => this.manage_member(username, "TEAM_LEADER")}>
				<i className="fas fa-chevron-down"></i>
			</Button>
		) : null;
		let promote = this.props.show_manage_buttons ? (
			<Button
				key={username + "promote"}
				variant="success"
				onClick={() => this.manage_member(username, "ADMIN")}>
				<i className="fas fa-chevron-up"></i>
			</Button>
		) : null;
		let remove = (
			<Button
				key={username + "remove"}
				variant="danger"
				onClick={() => this.remove_member(username)}>
				<i className="fas fa-times"></i>
			</Button>
		);

		// if the Managing User is an Organisation Owner
		if (org_member_details.get(this.state.username).role === "ORG_OWNER") {
			// Member Button Loading from Input
			if (role === "ORG_OWNER") {
				// Display Nothing
			} else if (role === "ADMIN") {
				ret = [demote, remove];
			} else if (role === "TEAM_LEADER") {
				ret = [promote, demote, remove];
			} else {
				ret = [promote, remove];
			}
		} else if (org_member_details.get(this.state.username).role === "ADMIN") {
			// Member Button Loading from Input
			if (role === "ORG_OWNER") {
				// Display Nothing
			} else if (role === "ADMIN") {
				// Display Nothing
			} else if (role === "TEAM_LEADER") {
				ret = [demote, remove];
			} else {
				ret = [promote, remove];
			}
		} else {
			// Return No Buttons
		}
		return <ButtonGroup className="align-self-end">{ret}</ButtonGroup>;
	}

	componentDidUpdate(prevProps) {
		if (this.props.members !== prevProps.members) {
			this.setState({members: this.props.members});
		}
	}

	render() {
		console.log(this.state.members);
		return (
			<ListGroup className="overflow-auto">
				{this.mapOrgUsers(this.state.members, this.props.show_buttons)}
			</ListGroup>
		);
	}
}

MemberListComponent.defaultProps = {
	show_buttons: false,
	show_manage_buttons: true
};
export default MemberListComponent;
