import React, {Component} from "react";
import "./DashboardComponent.css";
import TodoComponent from "../Todo/TodoComponent";
import {Container, Row, Col} from "react-bootstrap";
import ContactsResource from "../Contacts/ContactsResource.js"

class DashboardComponent extends Component {

	onClick() {
		let username = sessionStorage.getItem("authenticatedUser");
		ContactsResource.addContact(username, "Tyler (ScrumptiousMaster)")
	}

	render() {
		return (
			<div className="app-window dashboard-component">
				<Container fluid>
					<Row>
						<Col>
						    <button onClick={this.onClick}>Click Here to add Tyler as your bestest friend in the whole wide world</button>
						</Col>
						<Col>
							<TodoComponent />
						</Col>
					</Row>
					
				</Container>
			</div>
		);
	}
}

export default DashboardComponent;
