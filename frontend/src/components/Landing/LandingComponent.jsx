import React, { Component } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./LandingComponent.css";
import logoSVG from "../../assests/Logo_v4.svg";

class LandingComponent extends Component {
	render() {
		return (
			<div className="home-page">
				<div>
					<div className="login-container">
						<div className="logo-container">
							<img className="logo" src={logoSVG}></img>
						</div>
						<form className="login-form">
							<h1 className="login-title">LOGIN</h1>
							<div className="input-container">
								<p>Username</p>
								<input
									type="text"
									className="username-field"
								></input>
							</div>
							<div className="input-container">
								<p>Password</p>
								<input
									type="text"
									className="password-field"
								></input>
							</div>
							<div className="password-reset">
								<a>Forgot password?</a>
							</div>

							<input
								type="button"
								formAction="submit"
								className="login-button"
								value="SIGN IN"
							></input>
						</form>
						<div className="register-container">
							<p className="or">or</p>
							<hr></hr>
							<div className="create-account-container">
								<p>
									New user? <a>Create a new account</a>
								</p>
							</div>
						</div>
					</div>
					<div className="info-container">
						<p className="motto">THIS MOTTO.</p>
						<p className="more-motto">
							I'm baby 3 wolf moon sriracha bespoke shoreditch
							butcher coloring book. Retro live-edge XOXO man
							braid tofu scenester, umami listicle pok pok.{" "}
						</p>
					</div>
				</div>
			</div>
		);
	}
}

export default LandingComponent;
