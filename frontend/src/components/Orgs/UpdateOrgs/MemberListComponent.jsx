import React, {Component} from "react";
import {ListGroup, Button, ButtonGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {getRoleIconClassName} from "../OrgHelpers.js";

var orgMemberDetails = new Map();

class MemberListComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: props.username,
			members: props.members,
		};
		orgMemberDetails = new Map(props.org_member_details);
	}

	roleToString(role) {
		let ret = "";

		if (role === "ORG_OWNER") {
			ret = "Org Owner";
		} else if (role === "ADMIN") {
			ret = "Admin";
		} else if (role === "TEAM_LEADER") {
			ret = "Team Leader";
		}

		return ret;
	}

	mapOrgUsers(mapper, show_buttons) {
		let retDiv;
		// Ensure the Map Has Data
		if (orgMemberDetails.size > 0) {
			retDiv = mapper.map((member) => {
				return (
					<ListGroup.Item key={member.username} className="bg-light text-dark">
						<div className="d-flex justify-content-between">
							<p>
								{orgMemberDetails.get(member.username).name}{" "}
								{member.role === "TEAM_MEMBER" ? null : (
									<OverlayTrigger
										delay={{show: 400, hide: 0}}
										placement="right"
										overlay={
											<Tooltip>{this.roleToString(member.role)}</Tooltip>
										}>
										<i className={getRoleIconClassName(member.role)}> </i>
									</OverlayTrigger>
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
	manageMember(username, role) {
		this.props.manage_member(username, role);
	}
	removeMember(username) {
		this.props.remove_member(username);
	}
	// Maps all the Member Buttons for Promoting, Demoting and Removing
	mapOrgMemberButtons(username, role) {
		let ret = [];

		//Set to null if show_manage_buttons prop is false
		let demote = this.props.show_manage_buttons ? (
			<OverlayTrigger
				delay={{show: 400, hide: 0}}
				key={username + "demote"}
				placement="bottom"
				overlay={<Tooltip>Demote</Tooltip>}>
				<Button variant="warning" onClick={() => this.manageMember(username, "demote")}>
					<i className="fas fa-chevron-down"></i>
				</Button>
			</OverlayTrigger>
		) : null;
		let promote = this.props.show_manage_buttons ? (
			<OverlayTrigger
				delay={{show: 400, hide: 0}}
				key={username + "promote"}
				placement="bottom"
				overlay={<Tooltip>Promote</Tooltip>}>
				<Button variant="success" onClick={() => this.manageMember(username, "promote")}>
					<i className="fas fa-chevron-up"></i>
				</Button>
			</OverlayTrigger>
		) : null;
		let remove = (
			<OverlayTrigger
				delay={{show: 400, hide: 0}}
				key={username + "remove"}
				placement="bottom"
				overlay={<Tooltip>Remove</Tooltip>}>
				<Button variant="danger" onClick={() => this.removeMember(username)}>
					<i className="fas fa-times"></i>
				</Button>
			</OverlayTrigger>
		);

		// if the Managing User is an Organisation Owner
		if (orgMemberDetails.get(this.state.username).role === "ORG_OWNER") {
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
		} else if (orgMemberDetails.get(this.state.username).role === "ADMIN") {
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
		return (
			<ListGroup className="overflow-auto">
				{this.mapOrgUsers(this.state.members, this.props.show_buttons)}
			</ListGroup>
		);
	}
}

MemberListComponent.defaultProps = {
	show_buttons: false,
	show_manage_buttons: true,
};
export default MemberListComponent;
