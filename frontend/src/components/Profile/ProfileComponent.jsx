import React, { Component } from "react";
import "./ProfileComponent.css";

class ProfileComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: "John",
			lastName: "Doe",
			address: "Somewhere",
			bio: "Lorem ipsum",
			picUrl: "https://picsum.photos/200",
			imageError: ""
		};
		this.handleImageChange = this.handleImageChange.bind(this);
		this.handleChange = this.handleChange.bind(this);
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

	handleChange(event) {
		const { name: fieldName, value } = event.target;
		this.setState({
			[fieldName]: value
		});
	}

	render() {
		return (
			<div className="app-window profile-component">
				<header className="title-container">Profile</header>
				<form className="profile-update-form">
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
							<button className="cancel-button submit-button">
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
									name="firstName"
									type="text"
									value={this.state.firstName}
									onChange={this.handleChange.bind(this)}
								></input>
							</div>
							<div className="lName-container">
								<h3>Last name</h3>
								<input
									className="lName-input input-field"
									name="lastName"
									type="text"
									value={this.state.lastName}
									onChange={this.handleChange.bind(this)}
								></input>
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
