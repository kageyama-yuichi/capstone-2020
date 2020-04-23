import React, {Component} from "react";
import ProfileResources from "./ProfileResources.js";
import "./ProfileComponent.css";
import {Form, Col, Row, Button, Image, Container, Spinner} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import PlacesAutoComplete from "../Places/PlacesAutoComplete.jsx";

//TODO: Prevent XSS

class ProfileComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			firstname: "",
			lastname: "",
			address: "",
			bio: "",
			picUrl: "",
			id: "",
			imageError: "",
			firstnameError: "",
			lastnameError: "",
			addressError: "",
			validated: false,
		};
		this.handleImageChange = this.handleImageChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCancelClick = this.handleCancelClick.bind(this);
	}

	handleCancelClick() {
		this.props.history.goBack();
	}

	handleImageClick = (e) => {
		this.imageInputElement.click();
	};

	handleImageChange = (e) => {
		const imageFile = e.target.files[0];
		console.log(imageFile);
		let imageValid = true;

		if (!imageFile) {
			imageValid = false;
			this.setState({imageError: "Please select a valid file"});
		} else if (!imageFile.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
			imageValid = false;
			this.setState({imageError: "Please select a valid file"});
		} else if (imageFile.size > 500000) {
			//Image size must be less than 500KB
			imageValid = false;
			this.setState({imageError: "Image size must be less than 500KB"});
		}

		if (imageValid) {
			this.setState({
				picUrl: URL.createObjectURL(e.target.files[0]),
			});
		}
	};

	handleChange = (e) => {
		const {name: fieldName, value} = e.target;
		this.setState({
			[fieldName]: value,
		});
	};

	handleValidation() {
		let fields = this.state;
		let formIsValid = true;

		let nameRegex = new RegExp("[a-zA-Z]+");

		//First name cannot be empty or contain numbers
		if (!fields.firstname) {
			formIsValid = false;
			this.setState({firstnameError: "First name cannot be empty"});
		} else if (!nameRegex.test(fields.firstname)) {
			formIsValid = false;
			this.setState({
				firstnameError: "First name can only contain letters",
			});
		}

		//Last name cannot be empty or contain numbers
		if (!fields.lastname) {
			formIsValid = false;
			this.setState({lastnameError: "Last name Cannot be empty"});
		} else if (!nameRegex.test(fields.lastname)) {
			formIsValid = false;
			this.setState({
				lastnameError: "Last name can only contain letters",
			});
		}

		if (!fields.address) {
			formIsValid = false;
			this.setState({addressError: "Address Cannot be empty"});
		}

		return formIsValid;
	}

	onSubmit = (e) => {
		if (this.handleValidation()) {
			let prof = {
				id: this.state.id,
				username: this.state.username,
				fname: this.state.firstname,
				lname: this.state.lastname,
				address: this.state.address,
				bio: this.state.bio,
				imagePath: this.state.picUrl,
			};
			// Retrieve the User's Profile Information from the Server
			ProfileResources.updateUserProfile(this.state.username, prof);
			console.log("success");
			this.props.history.push(`/dashboard`);
		} else {
			e.preventDefault();
		}

		this.setState({validated: true});
	};

	refreshUserProfile = () => {
		// Retrieve the User's Profile Information from the Server
		ProfileResources.receiveUserProfile(this.state.username).then((response) => {
			console.log(response.data);
			this.setState({
				id: response.data.id,
				firstname: response.data.fname,
				lastname: response.data.lname,
				address: response.data.address,
				bio: response.data.bio,
				picUrl: response.data.imagePath,
			});
		});
	};

	componentDidMount() {
		this.refreshUserProfile();
	}

	handleAddressChange(address) {
		this.setState({address: address});
	}

	render() {
		return (
			<div className="app-window">
				<Container fluid style={{height: "100vh"}}>
					<h1 className="title-header border-bottom">Profile</h1>
					<Form
						as={Row}
						noValidate
						validated={this.state.validated}
						className="profile-update-form"
						onSubmit={this.onSubmit.bind(this)}>
						<Col lg={3} className="mb-5" style={{height: "fit-content"}}>
							<Container>
								<Form.Group>
									<div className="image-upload-current">
										<Image
											width="200"
											height="200"
											className="image-upload-current"
											src={this.state.picUrl}
											roundedCircle
										/>
										<div
											style={{height: "200px", width: "200px"}}
											className="image-upload-overlay"
											onClick={this.handleImageClick}>
											<div className="overlay-text">Upload Image</div>
										</div>
										<Button
											variant="link"
											className="help-text"
											onClick={this.handleImageClick}>
											Click to change profile picture
										</Button>
										<div className="image-upload-error">
											{this.state.imageError}
										</div>
									</div>

									<input
										className="image-upload-input"
										type="file"
										ref={(input) => (this.imageInputElement = input)}
										onChange={this.handleImageChange}
									/>

									<div className="cancel-button-container"></div>
								</Form.Group>
							</Container>
						</Col>

						<Container as={Col}>
							<Form.Row>
								<div className="container-title">
									<h2>Change your Profile details </h2>
								</div>
							</Form.Row>
							<Form.Row>
								<Form.Group sm={6} as={Col} controlId="validationCustom01">
									<Form.Label>First name</Form.Label>
									<Form.Control
										required
										className="fName-input"
										name="firstname"
										type="text"
										value={this.state.firstname}
										onChange={this.handleChange.bind(this)}
									/>
									<Form.Control.Feedback type="invalid">
										{this.state.firstnameError}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group sm={6} as={Col}>
									<Form.Label>Last name</Form.Label>
									<Form.Control
										required
										className="lName-input input-field"
										name="lastname"
										type="text"
										value={this.state.lastname}
										onChange={this.handleChange.bind(this)}
									/>
									<Form.Control.Feedback type="invalid">
										{this.state.lastnameError}
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={Col} className="address-container">
									<Form.Label>Address</Form.Label>

									<PlacesAutoComplete
										sessionToken={sessionStorage.getItem("authenticatedUser")}
										debounce="1000"
										minLetters={2}
										value={this.state.address}
										onChange={this.handleAddressChange.bind(this)}
									/>
									<Form.Control.Feedback type="invalid">
										{this.state.addressError}
									</Form.Control.Feedback>
								</Form.Group>
							</Form.Row>
							<Form.Row>
								<Form.Group as={Col} className="bio-container">
									<Form.Label>Biography</Form.Label>
									<Form.Control
										rows="15"
										as="textarea"
										name="bio"
										form="profile-update-form"
										value={this.state.bio}
										onChange={this.handleChange.bind(this)}
										placeholder="Create a bio!"
									/>
								</Form.Group>
							</Form.Row>
							<Form.Row className="align-bottom justify-content-end">
								<Form.Group>
									<Button
										type="button"
										variant="outline-primary"
										className="mr-2"
										onClick={this.handleCancelClick}>
										CANCEL
									</Button>

									<Button
										style={{whiteSpace: "nowrap"}}
										type="submit"
										variant="secondary">
										SAVE CHANGES
									</Button>
								</Form.Group>
							</Form.Row>
						</Container>
					</Form>
				</Container>
			</div>
		);
	}
}

export default ProfileComponent;
