import React, {Component} from "react";
import "./ForgotPasswordComponent.css";
import ForgotPasswordResource from "./ForgotPasswordResources.js";
import {Form, Button, Col, Container, Spinner} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";

class ForgotPasswordComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			email: "",
			username: "",
			errors: [],
			sessionToken: "",
		};
	}

	componentDidMount() {
	}

	handleValidation(e) {
		let fields = this.state;
		let formIsValid = true;
		let errors = [];
		let nameRegex = new RegExp("[a-zA-Z]+");
		let form = e.currentTarget;

		//Email must be a sequence of letters followed by @ then a sequence of letters followed by . and then another sequence of letters
		//Can be any length
		let emailRegex = new RegExp(
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
		);
		if (!fields.email) {
			errors.email = "Email Cannot be empty";
		} else if (!emailRegex.test(fields.email)) {
			errors.email = "Enter a valid email";
		}

		//Username must be between 4 to 20 letters long containing only letters and numbers
		let userRegex = new RegExp("^[A-Za-z0-9_-]{4,20}$");
		if (!fields.username) {
			errors.username = "Username Cannot be empty";
		} else if (!userRegex.test(fields.username)) {
			errors.username = "Username can only contain letters and numbers";
		} else if (fields.username.length < 4) {
			errors.username = "Username is too short";
		} else if (fields.username.length > 20) {
			errors.username = "Username is too long";
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

	handleChange(event) {
		const {name: fieldName, value} = event.target;
		this.setState({
			[fieldName]: value,
		});
	}


	onSubmit(e) {
		e.preventDefault();

		if (this.handleValidation(e)) {
			console.log("It was Valid");
		}
	}

	render() {
		if (this.state.searchOptions || !this.state.enableAutoComplete) {
			return (
				<div className="wrapper">
					<div className="bg" onClick={this.props.handler}></div>

					<div className="overlay">
						<button className="exit-button" onClick={this.props.handler}>
							X
						</button>
						<div className="info-text">
							<h1>Forgot Your Password?</h1>
						</div>

						<Form
							noValidate
							validated={this.state.validated}
							className="signup-form"
							onSubmit={this.onSubmit.bind(this)}>
							<Container style={{width: "100%"}}>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Email</Form.Label>

										<Form.Control
											type="email"
											name="email"
											placeholder="Email"
											onChange={this.handleChange.bind(this)}
											value={this.state.email}
										/>
										<Form.Control.Feedback type="invalid">
											{this.state.errors.email}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>
								<h1> or </h1>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Username</Form.Label>
										<Form.Control
											type="text"
											name="username"
											placeholder="Username"
											onChange={this.handleChange.bind(this)}
											value={this.state.username}
										/>
										<Form.Control.Feedback type="invalid">
											{this.state.errors.username}
										</Form.Control.Feedback>
									</Form.Group>

									
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<Button
											style={{width: "inherit"}}
											type="submit"
											className="submit-button btn-lg"
											variant="secondary">
											Recover 
										</Button>
									</Form.Group>
								</Form.Row>
							</Container>
						</Form>
					</div>
				</div>
			);
		} else {
			return (
				<div className="loading-spinner">
					<Spinner animation="border"></Spinner>;
				</div>
			);
		}
	}
}

export default ForgotPasswordComponent;
