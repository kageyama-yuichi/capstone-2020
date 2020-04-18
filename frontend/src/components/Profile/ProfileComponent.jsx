import React, {Component} from "react";
import "./ProfileComponent.css";
import ProfileResources from "./ProfileResources.js";
import {Form, Col, Button, Image, Container} from "react-bootstrap";

//TODO: Prevent XSS

class ProfileComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "Larrad.Tyler",
			firstname: "",
			lastname: "",
			address: "",
			bio: "",
			picUrl: "",
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
		const form = e.currentTarget;

		if (this.handleValidation()) {
			let prof = {
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

	render() {
		return (
			<div className="app-window profile-component">
				<Container fluid style={{height: "100vh"}}>
					<header className="title-container">Profile</header>
					<Form
						noValidate
						validated={this.state.validated}
						className="profile-update-form"
						onSubmit={this.onSubmit.bind(this)}>
						<div className="image-upload-wrapper">
							<Form.Group className="image-upload">
								<Image
									width="200"
									height="200"
									className="image-upload-current"
									src={this.state.picUrl}
									roundedCircle
								/>
								<div
									className="image-upload-overlay"
									onClick={this.handleImageClick}>
									<div className="overlay-text">Upload Image</div>
								</div>
								<input
									className="image-upload-input"
									type="file"
									ref={(input) => (this.imageInputElement = input)}
									onChange={this.handleImageChange}
								/>
							</Form.Group>
							<div className="help-text" onClick={this.handleImageClick}>
								Click to change profile picture
							</div>
							<div className="image-upload-error">{this.state.imageError}</div>
							<div className="cancel-button-container"></div>
						</div>
						<div className="info-container">
							<div className="container-title">
								<h2>Change your Profile details </h2>
							</div>
							<Form.Row>
								<Form.Group as={Col} controlId="validationCustom01">
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

								<Form.Group as={Col}>
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

							<Form.Group className="address-container">
								<Form.Label>Address</Form.Label>
								<Form.Control
									required
									className="address-input input-field"
									name="address"
									type="text"
									value={this.state.address}
									onChange={this.handleChange.bind(this)}
								/>
								<Form.Control.Feedback type="invalid">
									{this.state.addressError}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="bio-container">
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
							<Form.Row className="justify-content-end">
								<Form.Group md="1" as={Col}>
									<Button
										type="button"
										variant="outline-primary"
										onClick={this.handleCancelClick}>
										CANCEL
									</Button>
								</Form.Group>
								<Form.Group md="2" as={Col}>
									<Button type="submit" variant="secondary">
										SAVE CHANGES
									</Button>
								</Form.Group>
							</Form.Row>
						</div>
					</Form>
				</Container>
			</div>
		);
	}
}

export default ProfileComponent;
