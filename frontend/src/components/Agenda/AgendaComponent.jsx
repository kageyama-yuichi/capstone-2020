import React, {Component} from "react";
import "./AgendaComponent.css";
import TodoComponent from "../Todo/TodoComponent.jsx";
import {Container, Row, Col} from "react-bootstrap";

class AgendaComponent extends Component {
	render() {
		return (
			<div className="app-window">
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

export default AgendaComponent;
