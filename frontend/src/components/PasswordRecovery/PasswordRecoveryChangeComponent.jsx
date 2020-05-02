import React, {Component} from "react";
import {Container, Form, Button} from "react-bootstrap";
import PasswordRecoveryResources from "./PasswordRecoveryResources.js";

class PasswordRecoveryChangeComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			token: this.props.match.params.token,
			isValidToken: false,
		};
	}
	
	// Check if the Token was Valid
	componentDidMount() {
		// Ask Server to Validate Token
		PasswordRecoveryResources.checkPasswordResetToken(this.state.token).then((response) => {
			console.log(response.data);
			// if Token was Not Found, goBack
			if(response.data === ""){
				this.props.history.goBack();
			}
		});
	}

	render() {
		return (
			!this.state.isValidToken ? null : (
				<div className="app-window">
					<Container fluid>
						<div className="d-flex title-header border-bottom mb-3 w-100 justify-content-between">
							<h1 style={{height: "fit-content"}}>Create a New Password</h1>
						</div>

						<Form className="d-flex w-50 ml-auto mr-auto flex-column flex-fill ">
							<Form.Group>
								<Form.Label>New Password</Form.Label>
								<Form.Control placeholder="New Password" />
								<Form.Control.Feedback></Form.Control.Feedback>
							</Form.Group>
							<Form.Group>
								<Form.Label>Confirm New Password</Form.Label>
								<Form.Control placeholder="Confirm New Password" />
								<Form.Control.Feedback></Form.Control.Feedback>
							</Form.Group>

							<Form.Group className="align-bottom d-flex justify-content-end">
								<Button variant="secondary">SAVE</Button>
							</Form.Group>
						</Form>
					</Container>
				</div>
			)
		);
	}
}

export default PasswordRecoveryChangeComponent;
