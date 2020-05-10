import React, {Component} from "react";
import "./LandingComponent.css";
import FooterComponent from "../Footer/FooterComponent.jsx";
import RegisterComponent from "../Register/RegisterComponent.jsx";
import PasswordRecoveryComponent from "../PasswordRecovery/PasswordRecoveryComponent.jsx";
import logoSVG from "../../assests/Logo_v4.png";
import {Container, Form, Button} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";

class LandingComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			showRegister: false,
			showRecovery: false,
			windowSize: "",
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.registerSubmitHandler = this.registerSubmitHandler.bind(this);
		this.newUserOnClickHandler = this.newUserOnClickHandler.bind(this);
		this.recoveryOnClickHandler = this.recoveryOnClickHandler.bind(this);
	}

	newUserOnClickHandler() {
		this.setState({showRegister: !this.state.showRegister});
	}

	recoveryOnClickHandler() {
		this.setState({showRecovery: !this.state.showRecovery});
	}

	registerSubmitHandler() {
		this.props.history.push("/dashboard");
	}

	handleChange(event) {
		const {name: fieldName, value} = event.target;
		this.setState({
			[fieldName]: value,
		});
	}

	getBodyHeight() {
		return document.getElementsByTagName("body")[0].offsetHeight;
	}

	getBodyWidth() {
		return document.getElementsByTagName("body")[0].offsetWidth;
	}

	handle_typing_username = (event) => {
		this.setState({
			username: event.target.value,
		});
	};
	handle_typing_password = (event) => {
		this.setState({
			password: event.target.value,
		});
	};

	handleSubmit(e) {
		e.preventDefault();
		AuthenticationService.executeJwtAuthenticationService(
			this.state.username,
			this.state.password
		).then((response) => {
			AuthenticationService.registerSuccessfulLoginForJwt(
				this.state.username,
				response.data.token
			);
			let url = "/dashboard";
			this.props.history.push(url);
		});
	}

	componentDidMount() {
		localStorage.clear();
		sessionStorage.clear();
	}

	render() {
		return (
			<div>
				<div className="home-page">
					<div className="login-container">
						<Container style={{height: "100vh"}}>
							<div className="logo-container">
								<img className="logo" src={logoSVG} alt="Logo"></img>
							</div>
							<Form className="login-form" onSubmit={this.handleSubmit}>
								<h1 className="login-title">LOGIN</h1>
								<Form.Group className="input-container">
									<p className="input-name">Username</p>
									<input
										type="text"
										name="username"
										className="input-field username-field"
										placeholder="Enter your username"
										onChange={this.handleChange.bind(this)}
										value={this.state.username}></input>
								</Form.Group>
								<Form.Group className="input-container">
									<p className="input-name">Password</p>
									<input
										type="password"
										name="password"
										className="input-field password-field"
										placeholder="Enter your password"
										onChange={this.handleChange.bind(this)}
										value={this.state.password}></input>
								</Form.Group>
								<div className="password-reset">
									<Button
										variant="link"
										onClick={this.recoveryOnClickHandler}
										className="login-link-text">
										Forgot password?
									</Button>
								</div>

								<Button
									type="submit"
									variant="secondary"
									size="lg"
									className="submit-button button-lg">
									SIGN IN
								</Button>
							</Form>
							<div className="register-container">
								<div className="create-account-container">
									<p>
										New user?{" "}
										<Button
											variant="link"
											className="login-link-text"
											onClick={this.newUserOnClickHandler}>
											Create a new account
										</Button>
									</p>
								</div>
							</div>
						</Container>
						<FooterComponent />

						{window.innerHeight < window.innerWidth && this.getBodyWidth() > 1200 ? (
							<div className="info-container">
								<p className="motto">THIS MOTTO.</p>
								<p className="more-motto">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin
									quis ornare nulla. Pellentesque quis malesuada sem. Quisque
									elementum purus at lorem rhoncus, eu dictum purus malesuada.
								</p>
							</div>
						) : null}
					</div>
				</div>
				{this.state.showRegister ? (
					<RegisterComponent
						submitHandler={this.registerSubmitHandler}
						handler={this.newUserOnClickHandler}
					/>
				) : null}
				{this.state.showRecovery ? (
					<PasswordRecoveryComponent handler={this.recoveryOnClickHandler} />
				) : null}
			</div>
		);
	}
}

export default LandingComponent;