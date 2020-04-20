import React, {Component} from "react";
import "./RegisterComponent.css";
import {Form, Button, Col, Container, Spinner} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import {ENABLE_AUTOCOMPLETE} from "../../Constants.js"
import PlacesAutoComplete from "react-places-autocomplete";

// What's left to be done:
// When they register, redirect to Dashboard/username
// Currently this.props.history is undefined so cannot be pushed


// 
// TO ENABLE PLACES AUTOCOMPLETE
//	set ENABLE_AUTOCOMPLETE in Contants.js to true
// 	Create a file in the root directory (where package.json is) called .env
//	In the .env file write REACT_APP_PLACES_API_KEY=API_KEY
//	Get the API_KEY from console.cloud.google.com > APIs & Services > Credentials
//	
// Currently the api key is visible to the user if they inspect body
//	 This will be fixed when we move autocomplete to process in the backend
//	 As a measure the key is restricted to HTTP refers from localhost:6942
//	 


class RegisterComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			validated: false,
			firstname: "",
			lastname: "",
			email: "",
			address: "",
			username: "",
			password: "",
			errors: [],
			searchOptions: "",
			radius: 5000,
			//If the api key is in .env
			shouldFetchSuggestions: process.env.REACT_APP_PLACES_API_KEY ? true : false,
			//Forcibly turn off autocomplete
			enableAutoComplete: ENABLE_AUTOCOMPLETE
		};
		this.showLocation = this.showLocation.bind(this);
	}

	componentDidMount() {
		if (this.state.shouldFetchSuggestions && this.state.enableAutoComplete) {
			this.geoLocate();
		}
		
	}
	//Takes a google.maps.LatLng
	setSearchOptions(location) {
		//Generate session token
		var token = new window.google.maps.places.AutocompleteSessionToken();
		const options = {
			location: location,
			radius: this.state.radius,
			types: ["address"],
			sessionToken: token,
		};
		this.setState({searchOptions: options});
	}
	geoLocate() {
		if (navigator.geolocation) {
			//60s timeout
			var options = {timeout: 60000};
			navigator.geolocation.getCurrentPosition(this.showLocation, this.locationErrorHandler, options);
		} else {
			console.log("Geolocation is not supported by this browser.");
			const tempLocation = new window.google.maps.LatLng(37.8136, 144.9631);
			this.setSearchOptions(tempLocation);
		}
	}

	showLocation(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		const currentLocation = new window.google.maps.LatLng(latitude, longitude);
		this.setSearchOptions(currentLocation);
	}

	locationErrorHandler(err) {
		console.log("Error when getting geolocation.");

		const tempLocation = new window.google.maps.LatLng(37.8136, 144.9631);
		this.setSearchOptions(tempLocation);
	}

	handleValidation(e) {
		let fields = this.state;
		let formIsValid = true;
		let errors = [];
		let nameRegex = new RegExp("[a-zA-Z]+");
		let form = e.currentTarget;

		//First name cannot be empty or contain numbers
		if (!fields.firstname) {
			errors.firstname = "First name Cannot be empty";
		} else if (!nameRegex.test(fields.firstname)) {
			errors.firstname = "First name can only contain letters";
		}

		//Last name cannot be empty or contain numbers
		if (!fields.lastname) {
			errors.lastname = "Last name Cannot be empty";
		} else if (!nameRegex.test(fields.lastname)) {
			errors.lastname = "Last name can only contain letters";
		}

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
		//Might want to validate so that emails are unique

		//Address will be validated using google place api
		if (!fields.address) {
			errors.address = "Address Cannot be empty";
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
		//Will have to check if username is unique

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

	handleChange(event) {
		const {name: fieldName, value} = event.target;
		this.setState({
			[fieldName]: value,
		});
	}

	handleAddresChange(address) {
		this.setState({address: address});
	}

	onSubmit(e) {
		e.preventDefault();

		if (this.handleValidation(e)) {
			let user = {
				username: this.state.username,
				fname: this.state.firstname,
				lname: this.state.lastname,
				email: this.state.email,
				address: this.state.address,
				password: this.state.password,
				bio: "",
				imagePath: "",
			};
			//RegisterResources.registerUser(this.state.username, user);
			AuthenticationService.checkForUser(this.state.username).then((response) => {
				if (response.data === true) {
					this.setState({
						username: "",
						firstname: "",
						lastname: "",
						email: "",
						address: "",
						password: "",
					});
				} else {
					AuthenticationService.registerNewUser(user).then((response) => {
						AuthenticationService.executeJwtAuthenticationService(
							this.state.username,
							this.state.password
						).then((response) => {
							AuthenticationService.registerSuccessfulLoginForJwt(
								this.state.username,
								response.data.token
							);
							/*
							let url = '/dashboard/'+this.state.username;
							console.log(this.props.history);
							this.props.history.push(url);
							*/
						});
					});
				}
			});

			this.props.submitHandler();
		}

		this.setState({validated: true});
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
							<h1>Get started with your L8Z account</h1>
						</div>

						<Form
							noValidate
							validated={this.state.validated}
							className="signup-form"
							onSubmit={this.onSubmit.bind(this)}>
							<Container style={{width: "100%"}}>
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>First Name</Form.Label>
										<Form.Control
											type="text"
											name="firstname"
											placeholder="First name"
											onChange={this.handleChange.bind(this)}
											value={this.state.firstname}
										/>
										<Form.Control.Feedback type="invalid">
											{this.state.errors.firstname}
										</Form.Control.Feedback>
									</Form.Group>
									<Form.Group as={Col}>
										<Form.Label>Last Name</Form.Label>
										<Form.Control
											type="text"
											name="lastname"
											placeholder="Last name"
											onChange={this.handleChange.bind(this)}
											value={this.state.lastname}
										/>
										<Form.Control.Feedback type="invalid">
											{this.state.errors.lastname}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>
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
								<Form.Row>
									<Form.Group as={Col}>
										<Form.Label>Address</Form.Label>

										<PlacesAutoComplete
											value={this.state.address}
											onChange={this.handleAddresChange.bind(this)}
											searchOptions={this.state.searchOptions}
											debounce={1000}
											shouldFetchSuggestions={
												this.state.shouldFetchSuggestions && this.state.enableAutoComplete
											}>
											{({
												getInputProps,
												suggestions,
												getSuggestionItemProps,
												loading,
											}) => (
												<div>
													<input
														{...getInputProps({
															autoComplete: "justdont",
															name: "address",
															placeholder: "Address",
															required: true,
															className:
																"location-search-input form-control",
														})}
													/>
													<div className="autocomplete-dropdown-container zindex-dropdown">
														{loading && (
															<Spinner animation="grow"></Spinner>
														)}
														{suggestions.map((suggestion) => {
															const className = suggestion.active
																? "suggestion-item--active"
																: "suggestion-item";
															// inline style for demonstration purpose
															const style = suggestion.active
																? {
																		backgroundColor: "#fafafa",
																		cursor: "pointer",
																  }
																: {
																		backgroundColor: "#ffffff",
																		cursor: "pointer",
																  };
															return (
																<div
																	{...getSuggestionItemProps(
																		suggestion,
																		{
																			className,
																			style,
																		}
																	)}>
																	<span>
																		{suggestion.description}
																	</span>
																</div>
															);
														})}
													</div>
												</div>
											)}
										</PlacesAutoComplete>
										<Form.Control.Feedback type="invalid">
											{this.state.errors.address}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>

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

									<Form.Group as={Col}>
										<Form.Label>Password</Form.Label>
										<Form.Control
											className="password-control"
											type="password"
											name="password"
											placeholder="Password"
											onChange={this.handleChange.bind(this)}
											value={this.state.password}
										/>
										<Form.Control.Feedback type="invalid">
											{this.state.errors.password}
										</Form.Control.Feedback>
									</Form.Group>
								</Form.Row>
								<Form.Row className="justify-content-end">
									<Form.Text className="text-muted text-center">
										Password must use 6 or more characters with a mix of
										letters,numbers and symbols
									</Form.Text>
								</Form.Row>
								<Form.Row>
									<Form.Group as={Col}>
										<Button
											style={{width: "inherit"}}
											type="submit"
											className="submit-button btn-lg"
											variant="secondary">
											SIGN UP
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

export default RegisterComponent;
