import React, { Component } from "react";
import "./RegisterComponent.css";

class RegisterComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="wrapper">
				<div className="bg" onClick={this.props.handler}></div>

				<div className="overlay">
					<button className="exit-button" onClick={this.props.handler}>X</button>
					<div className="info-text">
						<h1>Get started with your L8Z account</h1>
						<h2>
							Some infomation about the benefits of creating an
							account. Probably want to keep it short and concise
							maybe like two to three lines max.
						</h2>
					</div>
					<form className="signup-form">
						<div className="input-container">
							<input
								type="text"
								className="input-field name-field"
								placeholder="Full name"
							></input>
						</div>
						<div className="input-container">
							<input
								type="email"
								className="input-field email-field"
								placeholder="Email"
							></input>
						</div>

						<div className="input-container">
							<input
								type="text"
								className="input-field address-field"
								placeholder="Address"
							></input>
						</div>

						<div className="input-container">
							<input
								type="text"
								className="input-field username-field"
								placeholder="Username"
							></input>
							<input
								type="text"
								className="input-field password-field"
								placeholder="Password"
							></input>
						</div>
						<p className="pass-info">
							Password must use 8 or more characters with a mix of
							letters, numbers and symbols
						</p>
						<input
							type="button"
							formAction="submit"
							className="signup-button"
							value="SIGN UP"
						></input>
					</form>
				</div>
			</div>
		);
	}
}

export default RegisterComponent;
