import React, {Component} from "react";
import OrgsResources from "../../OrgsResources.js";
import AuthenticationService from "../../../Authentication/AuthenticationService.js";
import "../../OrgsComponent.css";
import {Container, Button, Row, Col, ListGroup} from "react-bootstrap";

class InstancesComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgId: this.props.match.params.org_id,
			channelTitle: this.props.match.params.channel_title,
			instances: [],
			todos: [],
		};
		this.handleOpenChat = this.handleOpenChat.bind(this);
	}

	handleCreateInstance = () => {
		var url =
			this.props.history.location.pathname.slice(
				0,
				this.props.history.location.pathname.length - 10
			) + "/new";
		this.props.history.push(url);
	};

	handleOpenChat = (instance_title) => {
		let url =
			"/chat/" + this.state.orgId + "/" + this.state.channelTitle + "/" + instance_title;
		this.props.history.push(url);
	};

	componentDidUpdate() {}

	refreshInstances = () => {
		// Retrieves All Instances from the Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.orgId).then((response) => {
			// Maps the Response Data (Channels.class) to JSONbject
			for (let i = 0; i < response.data.channels.length; i++) {
				if (response.data.channels[i].channel_title === this.state.channelTitle) {
					// Map the Response Data (Instances.class) to JSONObject
					for (let j = 0; j < response.data.channels[i].instances.length; j++) {
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

	refreshTodos = () => {
		// Retrieves the Todos for the Organisation Channels
		OrgsResources.retrieve_org_todos(
			this.state.username,
			this.state.orgId,
			this.state.channelTitle
		).then((response) => {});
	};

	componentDidMount() {
		this.refreshInstances();
		this.refreshTodos();
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<h3>Instances</h3>
					</Col>
					<Col md={1}>
						<Button variant="outline-dark" onClick={this.handleCreateInstance}>
							<i className="fas fa-plus"></i>
						</Button>
					</Col>
				</Row>
				<Row>
					<Col>
						<ListGroup className="overflow-auto">
							{this.state.instances.map((ins) => (
								<ListGroup.Item
									action
									key={ins.channel_title}
									onClick={() => this.handleOpenChat(ins.instance_title)}
									className="channels"
									variant="dark">
									<div className="d-flex justify-content-between">
										{ins.instance_title}
									</div>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default InstancesComponent;
