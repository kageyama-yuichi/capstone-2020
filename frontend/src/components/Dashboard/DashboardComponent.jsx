import React, {Component} from "react";
import "./DashboardComponent.css";
import TodoComponent from "../Todo/TodoComponent.jsx";
import InvitesComponent from "../Invites/InvitesComponent.jsx";
import {Container, Row, Col, Accordion, Card, Button} from "react-bootstrap";
import OrgsWidgetComponent from "./Widgets/OrgsWidgetComponent";
import TodoWidgetComponent from "./Widgets/TodoWidgetComponent";

class DashboardComponent extends Component {
	render() {
		return (
			<div className="app-window dashboard-component">
				<Container fluid>
					<h1 className="title-header border-bottom ">Dashboard</h1>
					<Row className="window-body">
						<Col md={7} sm={12}>
							<OrgsWidgetComponent />
						</Col>
						<Col className="h-100" style={{overflowY: "auto"}}>
							<div >
								<Accordion defaultActiveKey="0" className="w-100">
									<Card>
										<Accordion.Toggle
											className="unselectable"
											style={{cursor: "pointer"}}
											as={Card.Header}
											variant="link"
											eventKey="0">
											<h3>Pending Invites</h3>
										</Accordion.Toggle>
										<Accordion.Collapse eventKey="0">
											<Card.Body>
												<InvitesComponent />
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>

								<Accordion className="flex-fill" defaultActiveKey="0" className="w-100">
									<Card>
										<Accordion.Toggle
											className="unselectable"
											style={{cursor: "pointer"}}
											as={Card.Header}
											variant="link"
											eventKey="0">
											<h3>Today's Todos</h3>
										</Accordion.Toggle>
										<Accordion.Collapse eventKey="0">
											<Card.Body className="p-0">
												<TodoWidgetComponent />
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default DashboardComponent;
