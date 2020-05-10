import React, {Component} from "react";
import {Container, Form, Button} from "react-bootstrap";

class PasswordChangeComponent extends Component {
	constructor(props) {
		super(props);

		this.handleCancel = this.handleCancel.bind(this);
	}

	handleCancel() {
		this.props.history.goBack();
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
							<Form.Control placeholder="Current Password" />
							<Form.Control.Feedback></Form.Control.Feedback>
						</Form.Group>
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
							<Button
								variant="outline-primary"
								className="mr-2"
								onClick={this.handleCancel}>
								CANCEL
							</Button>
							<Button variant="secondary">SAVE</Button>
						</Form.Group>
					</Form>
				</Container>
			</div>
		);
	}
}

export default PasswordChangeComponent;
