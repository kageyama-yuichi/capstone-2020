import React, {Component} from "react";
import {Container, Form, Button} from "react-bootstrap";
import PasswordChangeResources from "./PasswordChangeResources.js";
import AuthenticationService from "../Authentication/AuthenticationService.js";

class PasswordChangeComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			oldPassword: "THING",
			newPassword: "",
			confirmPassword: "",
		};
		this.handleCancel = this.handleCancel.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
	}

	handleCancel() {
		this.props.history.goBack();
	}
	
	handleUpdate(){
		if(this.state.oldPassword === PasswordChangeResources.receiveUserPassword(this.state.username)){
			if(this.state.newPassword === this.state.confirmPassword){
				PasswordChangeResources.updateUserPassword(this.username, this.newPassword)
			}
			else{
				console.log("New password don't match");
			}
		} else{
			console.log("Password Didn't match");
		}
	}

	render() {
		return (
			<div className="app-window">
				<Container fluid>
					<div className="d-flex title-header border-bottom mb-3 w-100 justify-content-between">
						<h1 style={{height: "fit-content"}}>Change your Password</h1>
					</div>

					<Form className="d-flex w-50 ml-auto mr-auto flex-column flex-fill ">
						<Form.Group>
							<Form.Label>Current Password</Form.Label>
							<Form.Control 
								placeholder="Current Password" required
								className="oldPassword-input"
								name="oldPassword" />
							<Form.Control.Feedback></Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<Form.Label>New Password</Form.Label>
							<Form.Control 
								placeholder="New Password" required
								className="newPassword-input"
								name="newPassword" />
							<Form.Control.Feedback></Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<Form.Label>Confirm New Password</Form.Label>
							<Form.Control 
								placeholder="Confirm New Password" required
								className="confirmPassword-input"
								name="confirmPassword" />
							<Form.Control.Feedback></Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="align-bottom d-flex justify-content-end">
							<Button
								variant="outline-primary"
								className="mr-2"
								onClick={this.handleCancel}>
								CANCEL
							</Button>
							<Button 
								variant="secondary" 
								onClick={this.handleUpdate}>
								SAVE
							</Button>
						</Form.Group>
					</Form>
				</Container>
			</div>
		);
	}
}

export default PasswordChangeComponent;
