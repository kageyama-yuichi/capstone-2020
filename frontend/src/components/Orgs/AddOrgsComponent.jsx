import AuthenticationService from '../Authentication/AuthenticationService.js'
import OrgsResources from './OrgsResources.js'
import React, {Component} from 'react'
import {Form, Container, Button} from "react-bootstrap";
import "./AddOrgsComponent.css";

class AddOrgsComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: '',
			org_title: '',
			owned_ids: [],
			errors: [],
			validated: false,
		};
		this.on_submit = this.on_submit.bind(this);
	}

	handleValidation(e) {
		e.preventDefault();
		var formIsValid = true;
		var str2 = this.state.org_id;
		var errors = {};
		var idRegex = new RegExp("^[a-z0-9_]+$");
		if (this.state.org_id.length < 3 || this.state.org_id === "new") {
			errors.id = "Org ID is too short";
			formIsValid = false;
		} else if (this.state.org_id.match(idRegex)) {
			errors.id = "Org ID can only contain letters numbers and underscores"
			formIsValid = false;
		}
		// Ensure Length is 3 or Greater
		if (this.state.org_title.length < 3) {
			errors.title = "Org Title is too short";
			formIsValid = false;
		}

		if (formIsValid) {
			// Check if the ID Exists
			for (let i = 0; i < this.state.owned_ids.length; i++) {
				var str1 = this.state.owned_ids[i].org_id;
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

	on_submit = (e) => {
		e.preventDefault();

		if (this.handleValidation(e)) {
			let org = {
				org_id: this.state.org_id,
				org_title: this.state.org_title,
				channels: [],
				members: [],
			};
			OrgsResources.create_org(this.state.username, org).then(() =>
				this.props.history.goBack()
			);
		}

		this.setState({validated: true});
	};

	handle_typing_org_id = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
			org_id: event.target.value
				.toLowerCase()
				.trim()
				.replace(/[^\w\s]/gi, ""),
			error: false,
		});
	};
	handle_typing_org_title = (event) => {
		this.setState({
			org_title: event.target.value,
			error: false,
		});
	};

	componentDidMount() {
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username).then((response) => {
			for (let i = 0; i < response.data.length; i++) {
				this.state.owned_ids.push({
					org_id: response.data[i],
				});
				this.setState({
					owned_ids: this.state.owned_ids,
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
						onSubmit={this.on_submit.bind(this)}>
						<Form.Group controlId="formOrgId">
							<Form.Label>Organisation Id</Form.Label>
							<Form.Control
								name="id"
								type="text"
								value={this.state.org_id}
								onChange={this.handle_typing_org_id}
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
								value={this.state.org_title}
								onChange={this.handle_typing_org_title}
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
						</Form.Group>
					</Form>
				</Container>
			</div>

		);
	}
}

export default AddOrgsComponent;
