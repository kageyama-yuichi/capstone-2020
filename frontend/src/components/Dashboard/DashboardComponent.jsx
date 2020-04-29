import React, {Component} from "react";
import "./DashboardComponent.css";
import TodoComponent from "../Todo/TodoComponent.jsx";
import InvitesComponent from "../Invites/InvitesComponent.jsx";
import {Container, Row, Col} from "react-bootstrap";

class DashboardComponent extends Component {
	render() {
		return (
			<div className="app-window dashboard-component">
				<Container fluid>
					<Row>
						<Col></Col>
						<Col>
							<Row>
								<InvitesComponent />
							</Row>
							<Row>
								<TodoComponent />
							</Row>
						</Col>
					</Row>
					
				</Container>
			</div>
		);
	}
}

export default DashboardComponent;
