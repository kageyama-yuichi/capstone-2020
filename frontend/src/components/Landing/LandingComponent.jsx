import React, {Component} from "react";
import "./LandingComponent.css";
import FooterComponent from "../Footer/FooterComponent.jsx";
import RegisterComponent from "../Register/RegisterComponent.jsx";
import logoSVG from "../../assests/Logo_v4.png";
import { Container, Form, Button } from "react-bootstrap";


class LandingComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showRegister: false,
			windowSize: "",
			username: "",
			password: "",
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.newUserOnClickHandler = this.newUserOnClickHandler.bind(this);
	}

	newUserOnClickHandler() {
		this.setState({showRegister: !this.state.showRegister});
	}

	//Handles dynamic styling for login form
	calcFormSize() {
		// let h =
		// 	document.getElementsByClassName("register-container")[0].offsetHeight +
		// 	document.getElementsByClassName("logo-container")[0].offsetHeight +
		// 	document.getElementsByClassName("login-form")[0].offsetHeight;

		// let cont = document.getElementsByClassName("cont")[0];
		// if (h <= this.getBodyHeight()) {
		// 	cont.style.height = "inherit";
		// } else {
		// 	cont.style.height = "fit-content";
		// }
	}
	//Called on resize
	handleResize = (e) => {
		const windowSize = window.innerWidth;

		this.calcFormSize();

		this.setState((prevState) => {
			return {windowSize};
		});
	};

	handleChange(event) {
		const {name: fieldName, value} = event.target;
		this.setState({
			[fieldName]: value,
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

	handleSubmit(e) {
		e.preventDefault();
		//Temporary solution to store username
		localStorage.setItem("username", this.state.username);
		this.props.history.push("/dashboard");
	}

	render() {
		return (
			<div className="home-page">
				<div className="login-container">
					<Container style={{height: "100vh"}}>
						<div className="logo-container">
							<img className="logo" src={logoSVG}></img>
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
								<a className="login-link-text">Forgot password?</a>
							</div>

							<Button
								type="submit"
								variant="secondary"
								size="lg"
								className="submit-button button-lg"
								>SIGN IN</Button>
						</Form>
						<div className="register-container">

							<div className="create-account-container">
								<p>
									New user?{" "}
									<a
										className="login-link-text"
										onClick={this.newUserOnClickHandler}>
										Create a new account
									</a>
								</p>
							</div>
						</div>
						{this.state.showRegister ? (
							<RegisterComponent handler={this.newUserOnClickHandler} />
						) : null}
					</Container>
					<FooterComponent />

					{window.innerHeight < window.innerWidth && this.getBodyWidth() > 1200 ? (
						<div className="info-container">
							<p className="motto">THIS MOTTO.</p>
							<p className="more-motto">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin quis
								ornare nulla. Pellentesque quis malesuada sem. Quisque elementum
								purus at lorem rhoncus, eu dictum purus malesuada.
							</p>
						</div>
					) : null}
				</div>
			</div>
		);
	}
}

export default LandingComponent;
