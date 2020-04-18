import React, {Component} from "react";
import "./DashboardComponent.css";
import TodoComponent from "../Todo/TodoComponent";
import {Container, Row, Col} from "react-bootstrap";

class DashboardComponent extends Component {
	render() {
		return (
			<div className="app-window dashboard-component">
				<Container fluid>
					<Row>
						<Col></Col>
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
