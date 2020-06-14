import AuthenticationService from "../Authentication/AuthenticationService.js";
import OrgsResources from "./OrgsResources.js";
import React, {Component} from "react";
import {Form, Container, Button} from "react-bootstrap";
import "./AddOrgsComponent.css";

class AddOrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgId: "",
			orgTitle: "",
			ownedIds: [],
			errors: [],
			validated: false,
		};
		this.onSubmit = this.onSubmit.bind(this);
	}

	handleValidation(e) {
		e.preventDefault();
		var formIsValid = true;
		var str2 = this.state.orgId;
		var errors = {};
		if (this.state.orgId.length < 3 || this.state.orgId === "new") {
			errors.id = "Org ID is too short";
			formIsValid = false;
		} else if (this.state.orgId.match(".*?[A-Z\\s].*")) {
			errors.id = "Org ID can only contain letters numbers and underscores";
			formIsValid = false;
		}
		// Ensure Length is 3 or Greater
		if (this.state.orgTitle.length < 3) {
			errors.title = "Org Title is too short";
			formIsValid = false;
		}

		if (formIsValid) {
			// Check if the ID Exists
			for (let i = 0; i < this.state.ownedIds.length; i++) {
				var str1 = this.state.ownedIds[i].org_id;
				// Compare the String Values
				if (str1.valueOf() === str2.valueOf()) {
					formIsValid = false;
				}
			}

			if (!formIsValid) {
				errors.id = "Org ID already used";
			}
		}

		let form = e.currentTarget;
		var formControl = Array.prototype.slice.call(form.querySelectorAll(".form-control"));

		//Iterate over input fields and get corresponding error
		//Flag form as invalid if there is an error
		formControl.forEach((ele) => {
			if (errors[ele.name]) {
				ele.setCustomValidity("invalid");
			} else {
				ele.setCustomValidity("");
			}
		});

		this.setState({errors: errors});

		return formIsValid;
	}

	onSubmit = (e) => {
		e.preventDefault();

		if (this.handleValidation(e)) {
			let org = {
				org_id: this.state.orgId,
				org_title: this.state.orgTitle,
				channels: [],
				members: [],
			};
			OrgsResources.create_org(this.state.username, org).then(() =>
				this.props.history.goBack()
			);
		}

		this.setState({validated: true});
	};

	handleTypingOrgId = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			org_id: event.target.value
				.toLowerCase()
				.trim()
				.replace(/[^\w\s]/gi, ""),
			error: false,
		});
	};
	handleTypingOrgTitle = (event) => {
		this.setState({
			org_title: event.target.value,
			error: false,
		});
	};

	componentDidMount() {
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				this.state.ownedIds.push({
					org_id: response.data[i],
				});
				this.setState({
					owned_ids: this.state.ownedIds,
				});
			}
		});
	}

	render() {
		return (
			<div className="add-orgs-component app-window">
				<Container className="add-orgs-container">
					<h1>Create an organisation</h1>
					<Form
						noValidate
						validated={this.state.validated}
						onSubmit={this.onSubmit.bind(this)}>
						<Form.Group controlId="formOrgId">
							<Form.Label>Organisation Id</Form.Label>
							<Form.Control
								autoComplete="off123"
								name="id"
								type="text"
								value={this.state.orgId}
								onChange={this.handleTypingOrgId}
								placeholder="Enter a unique id"
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.errors.id}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group controlId="formOrgTitle">
							<Form.Label>Organisation Title</Form.Label>
							<Form.Control
								type="text"
								name="title"
								value={this.state.orgTitle}
								onChange={this.handleTypingOrgTitle}
								placeholder="Enter a title"
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.errors.title}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<Button variant="secondary" type="submit">
								Submit
							</Button>
							<Button
								onClick={() => this.props.history.goBack()}
								variant="outline-primary">
								Cancel
							</Button>
						</Form.Group>
					</Form>
				</Container>
			</div>
		);
	}
}

export default AddOrgsComponent;
