import React, { Component } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./LandingComponent.css";
import FooterComponent from "../Footer/FooterComponent.jsx";
import RegisterComponent from "../Register/RegisterComponent.jsx";
import logoSVG from "../../assests/Logo_v4.png";
import AuthenticationService from '../Authentication/AuthenticationService.js'


class LandingComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			showRegister: false,
			windowSize: "",
			username: "",
			password: ""
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.newUserOnClickHandler = this.newUserOnClickHandler.bind(this);
	}

	newUserOnClickHandler() {
		this.setState({ showRegister: !this.state.showRegister });
	}

	//Handles dynamic styling for login form
	calcFormSize() {
		let h =
			document.getElementsByClassName("register-container")[0]
				.offsetHeight +
			document.getElementsByClassName("logo-container")[0].offsetHeight +
			document.getElementsByClassName("login-form")[0].offsetHeight;

		let cont = document.getElementsByClassName("cont")[0];
		if (h <= this.getBodyHeight()) {
			cont.style.height = "100%";
		} else {
			cont.style.height = "fit-content";
		}
	}
	//Called on resize
	handleResize = e => {
		const windowSize = window.innerWidth;

		this.calcFormSize();

		this.setState(prevState => {
			return { windowSize };
		});
	};
	
	handleChange(event) {
		const { name: fieldName, value } = event.target;
		this.setState({
			[fieldName]: value
		});
	}

	componentDidMount() {
		window.addEventListener("resize", this.handleResize);
		this.calcFormSize();
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleResize);
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
	}
	handle_typing_password = (event) => {
		this.setState({
            password: event.target.value,
        });
	}
	
	handleSubmit(e) {
		e.preventDefault();
		console.log(this.state.username);
		console.log(this.state.password);
		
		AuthenticationService
			.executeJwtAuthenticationService(this.state.username, this.state.password)
			.then((response) => {
				console.log("Inner Authetnication");
				AuthenticationService.registerSuccessfulLoginForJwt(this.state.username, response.data.token)
				let url = '/dashboard/'+this.state.username;
				this.props.history.push(url);
			})
		
		//this.props.history.push("/dashboard");
	}

	render() {
		return (
			<div className="home-page">
				<div>
					<div className="login-container">
						<div className="cont">
							<div className="logo-container">
								<img className="logo" src={logoSVG}></img>
							</div>
							<form className="login-form" onSubmit={this.handleSubmit}>
								<h1 className="login-title">LOGIN</h1>
								<div className="input-container">
									<p className="input-name">Username</p>
									<input
										type="text"
										name="username"
										className="input-field username-field"
										placeholder="Enter your username"
<<<<<<< HEAD
										value={this.state.username}
										onChange={this.handle_typing_username}
=======
										onChange={this.handleChange.bind(this)}
										value={this.state.username}
>>>>>>> d960f87757ecc6a3246d91dc02e8eaecabce604f
									></input>
								</div>
								<div className="input-container">
									<p className="input-name">Password</p>
									<input
										type="text"
										name="password"
										className="input-field password-field"
										placeholder="Enter your password"
<<<<<<< HEAD
										value={this.state.password}
										onChange={this.handle_typing_password}
=======
										onChange={this.handleChange.bind(this)}
										value={this.state.password}
>>>>>>> d960f87757ecc6a3246d91dc02e8eaecabce604f
									></input>
								</div>
								<div className="password-reset">
									<a className="login-link-text">Forgot password?</a>
								</div>

								<input
									type="submit"
									className="login-button submit-button"
									value="SIGN IN"
								></input>
							</form>
							<div className="register-container">
								<p className="or">or</p>
								<hr></hr>
								<div className="create-account-container">
									<p>
										New user?{" "}
										<a className="login-link-text" onClick={this.newUserOnClickHandler}>
											Create a new account
										</a>
									</p>
								</div>
							</div>
							{this.state.showRegister ? (
								<RegisterComponent
									handler={this.newUserOnClickHandler}
								/>
							) : null}
						</div>
						<FooterComponent />
					</div>
					{window.innerHeight < window.innerWidth &&
					this.getBodyWidth() > 1200 ? (
						<div className="info-container">
							<p className="motto">THIS MOTTO.</p>
							<p className="more-motto">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis ornare nulla. Pellentesque quis malesuada sem. Quisque elementum purus at lorem rhoncus, eu dictum purus malesuada.
							</p>
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

export default LandingComponent;
