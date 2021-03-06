import React, {Component} from "react";
import OrgsResources from "../OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import "../OrgsComponent.css";
import {Container, Form, Button} from "react-bootstrap";

class AddChannelsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgId: this.props.match.params.org_id,
			channelTitle: "",
			channelTitleError: "",
			ownedIds: [],
			validated: false,
		};
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit = (e) => {
		e.preventDefault();
		var internal_error = false;
		var error = "";
		var str2 = this.state.channelTitle;

		// Ensure Length is 3 or Greater
		if (this.state.channelTitle.length < 3 || this.state.channelTitle === "new") {
			error = "Channel title too short";
			internal_error = true;
		}

		if (!internal_error) {
			// Check if the ID Exists
			for (let i = 0; i < this.state.ownedIds.length; i++) {
				var str1 = this.state.ownedIds[i].channel_title;
				// Compare the String Values
				if (str1.valueOf() === str2.valueOf()) {
					internal_error = true;
				}
			}

			if (internal_error) {
				error = "Channel title already in use";
			} else {
				let channel = {
					channel_title: this.state.channelTitle,
					members: [],
					instances: [],
				};
				OrgsResources.create_channel(
					this.state.username,
					this.state.orgId,
					channel
				).then(() => this.props.history.goBack());
			}
		}

		if (error.length > 0) {
			e.currentTarget.querySelector(".form-control").setCustomValidity("invalid");
		}

		this.setState({channelTitleError: error, validated: true});
	};

	handleTypingChannelTitle = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			channelTitle: event.target.value,
			channelTitleError: false,
		});
	};

	componentDidMount() {
		// Retrieves All the Current Channel IDs For the Organisation
		OrgsResources.retrieve_all_channel_titles(this.state.username, this.state.orgId).then(
			(response) => {
				for (let i = 0; i < response.data.length; i++) {
					this.state.ownedIds.push({
						channel_title: response.data[i],
					});
					this.setState({
						ownedIds: this.state.ownedIds,
					});
				}
			}
		);
	}

	render() {
		return (
			<div className="app-window FormChannelComponent">
				<Container>
					<h1>Register a Channel</h1>

					<Form
						noValidate
						validated={this.state.validated}
						onSubmit={this.onSubmit.bind(this)}>
						<Form.Group>
							<Form.Label>Channel Title</Form.Label>
							<Form.Control
								type="text"
								name="channel_title"
								id="channel_title"
								value={this.state.channelTitle}
								onChange={this.handleTypingChannelTitle}
								placeholder="Channel Title"
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.channelTitleError}
							</Form.Control.Feedback>
						</Form.Group>
						<Button id="channel_create" variant="secondary" type="submit">
							Create Channel
						</Button>
						<Button
							onClick={() => this.props.history.goBack()}
							variant="outline-primary">
							Cancel
						</Button>
					</Form>
				</Container>
			</div>
		);
	}
}

export default AddChannelsComponent;
