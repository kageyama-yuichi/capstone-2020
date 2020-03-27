import React, { Component } from "react";
import "./RegisterComponent.css";

class RegisterComponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<div className="bg" onClick={this.props.handler}></div>

				<div className="popup">
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
							<p>Full name</p>
							<input type="text" className="name-field"></input>
                        </div>
                        <div className="input-container">
							<p>Email</p>
							<input type="email" className="email-field"></input>
                        </div>
                        <div className="input-container">
							<p>Username</p>
							<input type="text" className="username-field"></input>
                        </div>
                        <div className="input-container">
							<p>Password</p>
							<input type="text" className="password-field"></input>
                        </div>
                        <div className="input-container">
							<p>Address</p>
							<input type="text" className="name-field"></input>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default RegisterComponent;
