import React, {Component} from "react";
import "./DashboardComponent.css";
import TodoComponent from "../Todo/TodoComponent.jsx";
import InvitesComponent from "../Invites/InvitesComponent.jsx";
import {Container, Row, Col} from "react-bootstrap";
import OrgsWidgetComponent from "./Widgets/OrgsWidgetComponent";

class DashboardComponent extends Component {
	render() {
		return (
			<div className="app-window dashboard-component">
				<Container fluid>
					<h1 className="title-header border-bottom ">Dashboard</h1>
					<Row className="window-body">
						<Col md={7} sm={12}>
							<OrgsWidgetComponent/>
						</Col>
						<Col md={5} sm={12}>
							<Row className="h-50">
								<InvitesComponent />
							</Row>
							<Row className="h-50">
								<TodoComponent isWidget={true}/>
							</Row>
						</Col>
					</Row>
					
				</Container>
			</div>
		);
	}
}

export default DashboardComponent;
