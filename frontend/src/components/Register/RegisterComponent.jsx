import React, { Component } from "react";
import RegisterResources from './RegisterResources.js';
import AuthenticationService from '../Authentication/AuthenticationService.js'
import "./RegisterComponent.css";

// What's left to be done:
// When they register, redirect to Dashboard/username
// Currently this.props.history is undefined so cannot be pushed


class RegisterComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: "",
			lastname: "",
			email: "",
			address: "",
			username: "",
			password: "",
			errors: []
		};
	}

	handleValidation() {

		let fields = this.state;
		const errors = [];
		let formIsValid = true;

		let nameRegex = new RegExp("[a-zA-Z]+");

		//First name cannot be empty or contain numbers
		if (!fields.firstname) {
			formIsValid = false;
			errors.push("First name Cannot be empty");
		} else if (!nameRegex.test(fields.firstname)) {
			formIsValid = false;
			errors.push("First name can only contain letters");
		}

		//Last name cannot be empty or contain numbers
		if (!fields.lastname) {
			formIsValid = false;
			errors.push("Last name Cannot be empty");
		} else if (!nameRegex.test(fields.lastname)) {
			formIsValid = false;
			errors.push("Last name can only contain letters");
		}

		//Email must be a sequence of letters followed by @ then a sequence of letters followed by . and then another sequence of letters
		//Can be any length
		let emailRegex = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$");
		if (!fields.email) {
			formIsValid = false;
			errors.push("Email Cannot be empty");
		} else if (!emailRegex.test(fields.email)) {
			formIsValid = false;
			errors.push("Enter a valid email");
		}
		//Might want to validate so that emails are unique

		//Address will be validated using google place api
		if (!fields.address) {
			formIsValid = false;
			errors.push("Address Cannot be empty");
		}

		//Username must be between 4 to 20 letters long containing only letters and numbers
		let userRegex = new RegExp("^[A-Za-z0-9_-]{4,20}$");
		if (!fields.username) {
			formIsValid = false;
			errors.push("Username Cannot be empty");
		} else if (!userRegex.test(fields.username)) {
			formIsValid = false;
			errors.push("Username can only contain letters and numbers");
		} else if (fields.username.length < 4) {
			formIsValid = false;
			errors.push("Username is too short");
		} else if (fields.username.length > 20) {
			formIsValid = false;
			errors.push("Username is too long");
		}
		//Will have to check if username is unique

		//Password expects at least 1 lowercase letter, 1 uppercase letter and 1 digit.
		//Length should be greater than 6 characters
		let passwordRegex = new RegExp(
			"((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,}))"
		);
		if (!fields.password) {
			formIsValid = false;
			errors.push("Password Cannot be empty");
	
		} else if (!passwordRegex.test(fields.password)) {
			formIsValid = false;
			errors.push("Password should be longer than 6 characters containing at least 1 lowercase letter, 1 uppercase letter and 1 digit");
		
		}
		return errors;
	}

	handleChange(event) {
		const { name: fieldName, value } = event.target;
		this.setState({
			[fieldName]: value
		});
	}

	onSubmit(e) {
		e.preventDefault();
		let err = this.handleValidation();
		this.setState({ errors: err });	
		
		if (err.length === 0) {
			console.log("success");
			let user = {
				username: this.state.username,
				fname: this.state.firstname,
				lname: this.state.lastname,
				email: this.state.email,
				address: this.state.address,
				password: this.state.password,
				bio: '',
				imagePath: ''
			}
			//RegisterResources.registerUser(this.state.username, user);
			AuthenticationService.checkForUser(this.state.username)
			.then((response) => {
				console.log(response.data);
				if (response.data == true) {
					this.setState({
						username:'',
						firstname:'',
						lastname:'',
						email:'',
						address:'',
						password:''
					})
				} else {
					AuthenticationService.registerNewUser(user).then((response) => {
						AuthenticationService
						.executeJwtAuthenticationService(this.state.username, this.state.password)
						.then((response) => {
							AuthenticationService.registerSuccessfulLoginForJwt(this.state.username, response.data.token)
							/*
							let url = '/dashboard/'+this.state.username;
							console.log(this.props.history);
							this.props.history.push(url);
							*/
						})
					})
				}
			})

		} else {
			console.log("fail");
		}

	}

	render() {
		return (
			<div className="wrapper">
				<div className="bg" onClick={this.props.handler}></div>

				<div className="overlay">
					<button
						className="exit-button"
						onClick={this.props.handler}
					>
						X
					</button>
					<div className="info-text">
						<h1>Get started with your L8Z account</h1>
						
					</div>
					
					<form
						className="signup-form"
						onSubmit={this.onSubmit.bind(this)}
					>
						<div className="error-container">
							{this.state.errors.map(error => (
								<p key={error}>{error}</p>
							))}
						</div>
						<div className="input-container">
						
							<input
								type="text"
								className="input-field firstname-field"
								name="firstname"
								placeholder="First name"
								onChange={this.handleChange.bind(this)}
								value={this.state.firstname}
							></input>

							<input
								type="text"
								className="input-field lastname-field"
								name="lastname"
								placeholder="Last name"
								onChange={this.handleChange.bind(this)}
								value={this.state.lastname}
							></input>
						</div>
						<div className="input-container">
							<input
								type="email"
								className="input-field email-field"
								name="email"
								placeholder="Email"
								onChange={this.handleChange.bind(this)}
								value={this.state.email}
							></input>
						</div>

						<div className="input-container">
							<input
								type="text"
								className="input-field address-field"
								name="address"
								placeholder="Address"
								onChange={this.handleChange.bind(this)}
								value={this.state.address}
							></input>
						</div>

						<div className="input-container">
							<input
								type="text"
								className="input-field username-field"
								name="username"
								placeholder="Username"
								onChange={this.handleChange.bind(this)}
								value={this.state.username}
							></input>
							<input
								className="input-field password-field"
								type="password"
								name="password"
								placeholder="Password"
								onChange={this.handleChange.bind(this)}
								value={this.state.password}
							></input>
						</div>
						<p className="pass-info">
							Password must use 6 or more characters with a mix of
							letters, numbers and symbols
						</p>
						<input
							type="submit"
							className="signup-button submit-button"
							value="SIGN UP"
						></input>
						
					</form>
				</div>
			</div>
		);
	}
}

export default RegisterComponent;
