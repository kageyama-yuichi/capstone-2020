import React, {Component} from "react";
import {Container, Button, Form} from "react-bootstrap";
import PasswordRecoveryResources from "./PasswordRecoveryResources.js"

class PasswordRecoveryComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			valid: false,
			email: "",
			emailError: "",
		};
		this.handleValidation = this.handleValidation.bind(this);
	}

	handleChange(event) {
		const {name: fieldName, value} = event.target;
		this.setState({
			[fieldName]: value,
		});
	}

	handleValidation() {
		let valid = true;
		let error = "";
		const email = this.state.email;
		let emailRegex = new RegExp(
			"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
		);
		if (email.length < 0) {
			error = "Email cannot be empty";
		} else if (!emailRegex.test(email)) {
			error = "Enter a valid email";
		}
		let emailControl = document.getElementById("email");

		if (error !== "") {
			emailControl.setCustomValidity("invalid");
			valid = false;
			this.setState({emailError: error});
			console.log(error);
		} else {
			emailControl.setCustomValidity("");
			this.setState({emailError: ""});
		}
		return valid;
	}

	onSubmit(e) {
		e.preventDefault();
		if (this.handleValidation()) {
			console.log(this.state.email);
			PasswordRecoveryResources.sendTokenForResetPassword(this.state.email).then((response) => {
				if(response.data) {
					this.setState({
						valid: true,
						validated: true
					})
				} else {
					alert("No account is associated with that email");
					this.setState({validated: false});
				}
			});
		}
	}

	render() {
		return (
			<div className="wrapper">
				<div className="bg" onClick={this.props.handler}></div>

				<div className="overlay" style={{width: "600px", height: "400px"}}>
					<Container className="h-100 pt-5 pb-5 w-75 d-flex  justify-content-center align-items-center flex-column">
						<h3>Reset your password</h3>
						<p className="text-center pb-3 border-bottom">
							Enter your email address below and we'll send you a link to reset your
							password
						</p>
						{this.state.valid ? (
							<h4 className="p-3 bg-secondary text-white rounded text-center">Your password reset email has been sent!</h4>
						) : (
							<Form
								noValidate
								validated={this.state.validated}
								onSubmit={this.onSubmit.bind(this)}
								className="w-100 d-flex align-items-center flex-column">
								<Form.Group className="w-75">
									<Form.Label>Email</Form.Label>
									<Form.Control
										onChange={this.handleChange.bind(this)}
										placeholder="Email"
										id="email"
										name="email"
										type="email"
									/>
									<Form.Control.Feedback type="invalid">
										{this.state.emailError}
									</Form.Control.Feedback>
								</Form.Group>
								<Button className="w-50" type="submit" variant="secondary">
									RESET PASSWORD
								</Button>
							</Form>
						)}

						<Button onClick={this.props.handler} className="mt-auto" variant="link">Back to login</Button>
					</Container>
				</div>
			</div>
		);
	}
}

export default PasswordRecoveryComponent;
