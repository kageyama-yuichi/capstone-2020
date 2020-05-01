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
		};

		this.handleAddInstanceClick = this.handleAddInstanceClick.bind(this);
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

	componentDidMount() {
		this.refresh_channels();
		this.refresh_instances();
	}

	//Change angle
	handleHeaderClick(channel_title) {
		const newIsExpanded = this.state.isExpanded;
		for (var key in newIsExpanded) {
			if (key === channel_title) {
				newIsExpanded[key] = !newIsExpanded[key];
			} else {
				newIsExpanded[key] = false;
			}
		}

		this.setState({isExpanded: newIsExpanded});
		console.log(this.state.isExpanded);
	}

	handleAddInstanceClick(channel_title) {
		let url = "/orgs/" + this.state.org_id + "/" + channel_title + "/new";
		this.props.history.push(url);
	}

	handleChannelSettingsClick(ch) {
		let url = "/orgs/" + this.state.org_id + "/" + ch.channel_title;
		this.props.history.push({
			pathname: url,
			state: {channel: ch}
		});
	}

	render() {
		console.log(this.state.channels);
		return (
			<div className="side-channel-list">
				<Container fluid>
					<h3 className="text-light">{this.state.org_id}</h3>

					{this.state.channels.map((ch) => (
						<Accordion>
							<Card className="rounded-0" key={ch.channel_title}>
								<div className="d-flex justify-content-between">
									<Accordion.Toggle
										as={Card.Header}
										eventKey={ch.channel_title}
										className="unselectable pr-0 flex-fill border-bottom-0"
										onClick={() => {
											this.handleHeaderClick(ch.channel_title);
										}}>
										<div className="d-flex align-items-center">
											{this.state.isExpanded[ch.channel_title] ? (
												<i className="fas fa-angle-down"></i>
											) : (
												<i className="fas fa-angle-right"></i>
											)}
											{ch.channel_title}
											
										</div>
									</Accordion.Toggle>
									<ButtonGroup>
										<Button
											variant="light"
											onClick={() =>
												this.handleAddInstanceClick(ch.channel_title)
											}>
											<i className="fas fa-plus"></i>
										</Button>
										<Button variant="light"
											onClick={() => this.handleChannelSettingsClick(ch)}
										>
											<i className="fas fa-cog"></i>
										</Button>
									</ButtonGroup>
								</div>

								<Accordion.Collapse eventKey={ch.channel_title}>
									<ListGroup variant="flush">
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
					))}
				</Container>
			</div>
		);
	}
}
export default ChannelListComponent;
