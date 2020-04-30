import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import "../OrgsComponent.css";
import {Container, Button, ButtonGroup, Row, Col, ListGroup} from "react-bootstrap";
import {getRoleIconClassName} from "../OrgHelpers.js";

/*
	Left to do:
	Display the Delete Button Only for ORG_OWNER
	Display the Update Button Only for ORG_OWNER and ADMIN
*/

class ChannelsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channels: [],
			memberListOpen: [],
		};
		this.handle_open_channel = this.handle_open_channel.bind(this);
	}

	handle_create_channel = () => {
		var url =
			this.props.history.location.pathname.slice(
				0,
				this.props.history.location.pathname.length - 9
			) + "/new";
		this.props.history.push(url);
	};

	handle_open_channel = (channel_title) => {
		let url = "/orgs/" + this.state.org_id + "/" + channel_title + "/instances";
		this.props.history.push(url);
	};

	componentDidUpdate() {
		console.log(this.state.orgs);
	}

	refresh_channels = () => {
		// Retrieves All Channels from the Org Data
		console.log(this.state.org_id);
		OrgsResources.retrieve_org(this.state.username, this.state.org_id).then((response) => {
			this.setState({
				channels: response.data.channels,
			});
		});
	};

	componentDidMount() {
		this.refresh_channels();
	}

	setRoleStyling = (role) => {
		var ret = "light";

		if (role === "ORG_OWNER") {
			ret = "danger";
		} else if (role === "ADMIN") {
			ret = "warning";
		} else if (role === "TEAM_LEADER") {
			ret = "info";
		}

		return ret;
	};

	toggleMemberListDisplay(channel_title) {
		this.state.memberListOpen[channel_title] = !this.state.memberListOpen[channel_title];
		this.forceUpdate();
	}

	render() {
		console.log("System - Rendering Page...");
		console.log(this.props.history.location);

		return (
			<Container>
				<Row>
					<Col>
						<h3>Channels</h3>
					</Col>
					<Col md={1}>
						<Button variant="outline-dark" onClick={this.handle_create_channel}>
							<i className="fas fa-plus"></i>
						</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<ListGroup className="overflow-auto">
							{this.state.channels.map((ch) => (
								<ListGroup.Item
									action
									onClick={() => this.handle_open_channel(ch.channel_title)}
									key={ch.channel_title}
									className="channels"
									variant="dark">
									
									<div className="d-flex justify-content-between">
									<div className="h-100 w-75">{ch.channel_title}</div>
										

										<Button
											variant="secondary"
											className="btn-sm align-self-end"
											onClick={(e) => {
												e.stopPropagation();
												this.toggleMemberListDisplay(ch.channel_title);
											}}>
											{this.state.memberListOpen[ch.channel_title] ? (
												<i className="fas fa-angle-up"></i>
											) : (
												<i className="fas fa-caret-down"></i>
											)}
										</Button>
									</div>

									<ListGroup
										style={{
											display: this.state.memberListOpen[ch.channel_title]
												? "flex"
												: "none",
										}}>
										{ch.members.map((member) => {
											return (
												<ListGroup.Item
													key={member.username}
													className="bg-light text-dark"
													// variant={this.setRoleStyling(member.role)}
												>
													{member.username}{" "}
													{member.role === "TEAM_MEMBER" ? null : (
														<i
															className={getRoleIconClassName(
																member.role
															)}>
															{" "}
														</i>
													)}
												</ListGroup.Item>
											);
										})}
									</ListGroup>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default ChannelsComponent;
