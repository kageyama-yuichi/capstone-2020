import React, {Component} from "react";
import {
	Accordion,
	Card,
	Container,
	ListGroup,
	Button,
	ButtonGroup,
	OverlayTrigger,
	Tooltip,
} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./ChannelInstanceListComponent.css";
import OrgsResources from "./OrgsResources.js";

class ChannelListComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: props.orgId,
			channels: [],
			isExpanded: [],
			channel_title: "",
			org_title: ""
		};

		this.handleAddInstanceClick = this.handleAddInstanceClick.bind(this);
	}

	componentDidMount() {
		this.refresh_channels();
	}

	refresh_channels = () => {
		// Retrieves All Channels from the Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.org_id).then((response) => {
			let isExpanded = [];
			response.data.channels.map((ch) => {
				isExpanded[ch.channel_title] = false;
			});
			this.setState({
				org_title: response.data.org_title,
				channels: response.data.channels,
				isExpanded: isExpanded,
			});
		});
	};

	handle_create_channel = () => {
		var url = "/orgs/" + this.state.org_id + "/new";
		this.props.history.push(url);
	};

	//Change angle
	handleHeaderClick(channel_title) {
		const newIsExpanded = this.state.isExpanded;
		newIsExpanded[channel_title] = !newIsExpanded[channel_title];
		this.setState({isExpanded: newIsExpanded});
	}

	handleAddInstanceClick(channel_title) {
		let url = "/orgs/" + this.state.org_id + "/" + channel_title + "/new";
		this.props.history.push(url);
	}

	handleChannelSettingsClick(ch) {
		let url = "/orgs/" + this.state.org_id + "/" + ch.channel_title;
		this.props.history.push({
			pathname: url,
			state: {
				channel: ch,
				org_id: this.state.org_id,
			},
		});
	}

	//Returns true if the current logged in username is in the channel member list
	isUserInChannel(members) {
		for (var i in members) {
			if (members[i].username === this.state.username) {
				return true;
			}
		}
		return false;
	}

	onClick(channel_title) {
		OrgsResources.addFavChannel(this.state.username, this.state.org_id, channel_title);
	}

	getRole(members) {
		for (var i in members) {
			if (members[i].username === this.state.username) {
				return members[i].role;
			}
		}
		return "TEAM_MEMBER";
	}

	renderButtons(ch) {
		let role = this.getRole(ch.members);

		return (
			<ButtonGroup
				key={ch.channel_title}
				size="sm"
				className="mt-auto mb-auto"
				style={{height: "fit-content"}}>
				<OverlayTrigger
					delay={{show: 400, hide: 0}}
					placement="bottom"
					overlay={<Tooltip>Favourite</Tooltip>}>
					<Button onClick={() => this.onClick(ch.channel_title)} variant="dark">
						<i className="text-warning fas fa-star"></i>
					</Button>
				</OverlayTrigger>
				{role !== "TEAM_MEMBER" ? (
					<OverlayTrigger
						delay={{show: 400, hide: 0}}
						placement="bottom"
						overlay={<Tooltip>New Instance</Tooltip>}>
						<Button
							variant="dark"
							onClick={() => this.handleAddInstanceClick(ch.channel_title)}>
							<i className="text-success fas fa-plus"></i>
						</Button>
					</OverlayTrigger>
				) : null}
				{role !== "TEAM_MEMBER" ? (
					<OverlayTrigger
						delay={{show: 400, hide: 0}}
						placement="bottom"
						overlay={<Tooltip>Remove Users</Tooltip>}>
						<Button variant="dark" onClick={() => this.handleChannelSettingsClick(ch)}>
							<i className="fas fa-cog"></i>
						</Button>
					</OverlayTrigger>
				) : null}
			</ButtonGroup>
		);
	}

	render() {
		return (
			<div className="side-channel-list border-right bg-light">
				<Container fluid>
					<div className="d-flex justify-content-between">
						<h3>{this.state.org_title}</h3>
					</div>

					{this.state.channels.map((ch) =>
						this.isUserInChannel(ch.members) ? (
							<Accordion key={ch.channel_title}>
								<Card className="rounded-0" key={ch.channel_title}>
									<div className="pr-1 bg-dark d-flex justify-content-between border-bottom">
										<Accordion.Toggle
											as={Card.Header}
											eventKey={ch.channel_title}
											className="bg-primary text-light unselectable pl-2 pr-0 flex-fill border-bottom-0"
											onClick={() => {
												this.handleHeaderClick(ch.channel_title);
											}}>
											<div className="d-flex align-items-center">
												{this.state.isExpanded[ch.channel_title] ? (
													<i
														style={{width: "12px"}}
														className="fas fa-angle-down"></i>
												) : (
													<i
														style={{width: "12px"}}
														className="fas fa-angle-right"></i>
												)}

												{ch.channel_title}
											</div>
										</Accordion.Toggle>
										{this.renderButtons(ch)}
									</div>

									<Accordion.Collapse eventKey={ch.channel_title}>
										<ListGroup variant="flush">
											<ListGroup.Item
												className="pt-1 pb-1"
												action
												onClick={() =>
													this.props.todoCallback(
														ch.channel_title,
														this.getRole(ch.members)
													)
												}>
												<i className=" p-1 fas fa-list-ol"></i>
												Todo List
											</ListGroup.Item>
											{ch.instances.map((instance) => (
												<ListGroup.Item
													className="pt-1 pb-1"
													action
													onClick={() =>
														this.props.callback(
															ch.channel_title,
															instance.instance_title
														)
													}
													key={instance.instance_title}>
													<i className="p-1 fas fa-comment-alt"></i>

													{instance.instance_title}
												</ListGroup.Item>
											))}
										</ListGroup>
									</Accordion.Collapse>
								</Card>
							</Accordion>
						) : null
					)}
				</Container>
			</div>
		);
	}
}
export default ChannelListComponent;
