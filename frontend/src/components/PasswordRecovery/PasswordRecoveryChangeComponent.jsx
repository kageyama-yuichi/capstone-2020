import React, {Component} from "react";
import {Container, Form, Button} from "react-bootstrap";
import PasswordRecoveryResources from "./PasswordRecoveryResources.js";
import Encryption from "../Chat/Encryption.js";

class PasswordRecoveryChangeComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			token: this.props.match.params.token,
			id: "",
			errors: [],
			isValidToken: false,
			password_error: false,
			validated: false,
		};
	}

	// Check if the Token was Valid
	componentDidMount() {
		// Ask Server to Validate Token
		PasswordRecoveryResources.checkPasswordResetToken(this.state.token).then((response) => {
			console.log(response.data);
			// if Token was Not Found, goBack
			if (response.data === "") {
				this.props.history.goBack();
			} else {
				this.setState({
					username: response.data.username,
					id: response.data.id,
					isValidToken: true,
				});
			}
		});
	}

	savePassword() {
		console.log(this.state.username);
		console.log(this.state.password);
		console.log(this.state.token);
		console.log(this.state.id);
		this.setState({password: Encryption.encrpyt_message(this.state.password)});

		PasswordRecoveryResources.updateUserPassword(
			this.state.username,
			this.state.password,
			this.state.id
		).then((response) => {
			if (response.data) {
				this.props.history.push("/");
			}
		});
	}

	handleTypingPassword = (event) => {
		this.setState({
			password: event.target.value,
			passwordError: false,
		});
	};

	handleValidation(e) {
		let fields = this.state;
		let formIsValid = true;
		let errors = [];
		let form = e.currentTarget;

		//Password expects at least 1 lowercase letter, 1 uppercase letter and 1 digit.
		//Length should be greater than 6 characters
		let passwordRegex = new RegExp("((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))");
		if (!fields.password) {
			errors.password = "Password Cannot be empty";
		} else if (!passwordRegex.test(fields.password)) {
			errors.password = "Password is invalid";
		}

		var formControl = Array.prototype.slice.call(form.querySelectorAll(".form-control"));

		//Iterate over input fields and get corresponding error
		//Flag form as invalid if there is an error
		formControl.forEach((ele) => {
			if (errors[ele.name]) {
				formIsValid = false;
				ele.setCustomValidity("invalid");
			} else {
				ele.setCustomValidity("");
			}
		});

		this.setState({errors: errors});
		return formIsValid;
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation(e)) {
			this.savePassword();
		}

		this.setState({validated: true});
	}

	render() {
		return !this.state.isValidToken ? null : (
			<div className="app-window">
				<Container fluid>
					<div className="d-flex title-header border-bottom mb-3 w-100 justify-content-between">
						<h1 style={{height: "fit-content"}}>Create a New Password</h1>
					</div>

					<Form
						className="d-flex w-50 ml-auto mr-auto flex-column flex-fill"
						noValidate
						validated={this.state.validated}
						onSubmit={this.onSubmit.bind(this)}>
						<Form.Group>
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" value={this.state.username} disabled />
						</Form.Group>
						<Form.Group>
							<Form.Label>New Password</Form.Label>
							<Form.Control
								className="password-control"
								type="password"
								name="password"
								placeholder="New Password"
								onChange={this.handleTypingPassword}
								value={this.state.password}
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.errors.password}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="align-bottom d-flex justify-content-end">
							<Button variant="secondary" type="submit">
								SAVE
							</Button>
						</Form.Group>
					</Form>
				</Container>
			</div>
		);
	}
}

export default PasswordRecoveryChangeComponent;
