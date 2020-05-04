import React, {Component} from "react";
import {Accordion, Card, Container, ListGroup, Button, ButtonGroup} from "react-bootstrap";
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
		};

		this.handleAddInstanceClick = this.handleAddInstanceClick.bind(this);
	}

	componentDidMount() {
		this.refresh_channels();
		this.refresh_instances();
	}

	refresh_channels = () => {
		// Retrieves All Channels from the Org Data
		console.log(this.state.org_id);
		OrgsResources.retrieve_org(this.state.username, this.state.org_id).then((response) => {
			let isExpanded = [];
			response.data.channels.map((ch) => {
				isExpanded[ch.channel_title] = false;
			});
			this.setState({
				channels: response.data.channels,
				isExpanded: isExpanded,
			});
		});
	};
	refresh_instances = () => {
		// Retrieves All Instances from the Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.org_id).then((response) => {
			// console.log(response.data.channels);
			// Maps the Response Data (Channels.class) to JSONbject
			for (let i = 0; i < response.data.channels.length; i++) {
				if (response.data.channels[i].channel_title === this.state.channel_title) {
					// Map the Response Data (Instances.class) to JSONObject
					for (let j = 0; j < response.data.channels[i].instances.length; j++) {
						// console.log(response.data.channels[i]);
						this.state.instances.push({
							instance_title: response.data.channels[i].instances[j].instance_title,
							type: response.data.channels[i].instances[j].type,
						});
						this.setState({
							instances: this.state.instances,
						});
					}
				}
			}
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

	onClick(channel_title){
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
				<Button variant="dark">
					<i className="text-warning fas fa-star"></i>
				</Button>
				{role !== "TEAM_MEMBER" ? (
					<Button
						variant="dark"
						onClick={() => this.handleAddInstanceClick(ch.channel_title)}>
						<i className="text-success fas fa-plus"></i>
					</Button>
				) : null}
				{role !== "TEAM_MEMBER" ? (
					<Button variant="dark" onClick={() => this.handleChannelSettingsClick(ch)}>
						<i className="fas fa-cog"></i>
					</Button>
				) : null}
			</ButtonGroup>
		);
	}

	render() {
		console.log(this.state.channels);
		return (
			<div className="side-channel-list border-right border-primary">
				<Container fluid>
					<div className="d-flex justify-content-between">
						<h3>{this.state.org_id}</h3>

						<Button
							size="sm"
							className="align-self-center"
							style={{height: "fit-content"}}
							variant="outline-dark"
							onClick={this.handle_create_channel}>
							<i className="fas fa-plus"></i>
						</Button>
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

										<ButtonGroup
											size="sm"
											className="mt-auto mb-auto"
											style={{height: "fit-content"}}>
											<Button onClick={() => this.onClick(ch.channel_title)} variant="light" >
												<i className="text-warning fas fa-star"></i>
											</Button>
											<Button
												variant="light"
												onClick={() =>
													this.handleAddInstanceClick(ch.channel_title)
												}>
												<i className="text-success fas fa-plus"></i>
											</Button>
											<Button
												variant="light"
												onClick={() => this.handleChannelSettingsClick(ch)}>
												<i className="fas fa-cog"></i>
											</Button>
										</ButtonGroup>

										{this.renderButtons(ch)}

									</div>

									<Accordion.Collapse eventKey={ch.channel_title}>
										<ListGroup variant="flush">
											<ListGroup.Item
												className="pt-1 pb-1"
												action
												onClick={() =>
													this.props.todoCallback(
														ch.channel_title
													)
												}>
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
