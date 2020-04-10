import React, { Component } from "react";
import "./ProfileComponent.css";

//TODO: Prevent XSS

class ProfileComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: "",
			lastname: "",
			address: "",
			bio: "",
			picUrl: "",
			imageError: "",
			firstnameError: "",
			lastnameError: "",
			addressError: ""
		};
		this.handleImageChange = this.handleImageChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
	}

    handleCancelClick() {
        this.props.history.goBack();
    }

	handleImageClick = e => {
		this.imageInputElement.click();
	};

	handleImageChange = e => {
		const imageFile = e.target.files[0];
		console.log(imageFile);
		let imageValid = true;

		if (!imageFile) {
			imageValid = false;
			this.setState({ imageError: "Please select a valid file" });
		} else if (!imageFile.name.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
			imageValid = false;
			this.setState({ imageError: "Please select a valid file" });
		} else if (imageFile.size > 500000) {
			//Image size must be less than 500KB
			imageValid = false;
			this.setState({ imageError: "Image size must be less than 500KB" });
		}

		if (imageValid) {
			this.setState({
				picUrl: URL.createObjectURL(e.target.files[0])
			});
		}
	};

	handleChange = e => {
		const { name: fieldName, value } = e.target;
		this.setState({
			[fieldName]: value
		});
	};

	handleValidation() {
		let fields = this.state;
		let formIsValid = true;

		let nameRegex = new RegExp("[a-zA-Z]+");

		//First name cannot be empty or contain numbers
		if (!fields.firstname) {
			formIsValid = false;
			this.setState({ firstnameError: "First name cannot be empty" });
		} else if (!nameRegex.test(fields.firstname)) {
			formIsValid = false;
			this.setState({
				firstnameError: "First name can only contain letters"
			});
		}

		//Last name cannot be empty or contain numbers
		if (!fields.lastname) {
			formIsValid = false;
			this.setState({ lastnameError: "Last name Cannot be empty" });
		} else if (!nameRegex.test(fields.lastname)) {
			formIsValid = false;
			this.setState({
				lastnameError: "Last name can only contain letters"
			});
		}

		if (!fields.address) {
			formIsValid = false;
			this.setState({ addressError: "Address Cannot be empty" });
        }
        
        return formIsValid;
	}

	onSubmit = e => {
		e.preventDefault();
		if (this.handleValidation()) {
			console.log("success");
			this.props.history.push(`/dashboard`);
		}
	};

	render() {
		return (
			<div className="app-window profile-component">
				<header className="title-container">Profile</header>
				<form
					className="profile-update-form"
					onSubmit={this.onSubmit.bind(this)}
				>
					<div className="image-upload-wrapper">
						<div className="image-upload">
							<img
								className="image-upload-current"
								src={this.state.picUrl}
							/>
							<div
								className="image-upload-overlay"
								onClick={this.handleImageClick}
							>
								<div className="overlay-text">Upload Image</div>
							</div>
							<input
								className="image-upload-input"
								type="file"
								ref={input => (this.imageInputElement = input)}
								onChange={this.handleImageChange}
							/>
						</div>
						<div
							className="help-text"
							onClick={this.handleImageClick}
						>
							Click to change profile picture
						</div>
						<div className="image-upload-error">
							{this.state.imageError}
						</div>
						<div className="cancel-button-container">
							<button className="cancel-button submit-button"onClick={this.handleCancelClick}>
								CANCEL
							</button>
						</div>
					</div>
					<div className="info-container">
						<div className="container-title">
							<h2>Change your Profile details </h2>
						</div>
						<div className="name-container">
							<div className="fName-container">
								<h3>First name</h3>
								<input
									className="fName-input input-field"
									name="firstname"
									type="text"
									value={this.state.firstname}
									onChange={this.handleChange.bind(this)}
                                ></input>
                                <p className="form-error">{this.state.firstnameError}</p>
							</div>
							<div className="lName-container">
								<h3>Last name</h3>
								<input
									className="lName-input input-field"
									name="lastname"
									type="text"
									value={this.state.lastname}
									onChange={this.handleChange.bind(this)}
                                ></input>
                                <p className="form-error">{this.state.lastnameError}</p>
							</div>
						</div>
						<div className="address-container">
							<h3>Address</h3>
							<input
								className="address-input input-field"
								name="address"
								type="text"
								value={this.state.address}
								onChange={this.handleChange.bind(this)}
                            ></input>
                            <p className="form-error">{this.state.addressError}</p>
						</div>
						<div className="bio-container">
							<h3>Biography</h3>
							<textarea
								className="bio-input"
								name="bio"
								form="profile-update-form"
								value={this.state.bio}
								onChange={this.handleChange.bind(this)}
								placeholder="Create a bio!"
							></textarea>
						</div>
						<div className="submit-container">
							<input
								type="submit"
								className="profile-update-button submit-button"
								value="SAVE CHANGES"
							></input>
						</div>
					</div>
				</form>
			</div>
		);
	}
}

export default ProfileComponent;
