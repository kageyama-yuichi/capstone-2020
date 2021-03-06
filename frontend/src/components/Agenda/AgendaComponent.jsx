import React, {Component} from "react";
import "./AgendaComponent.css";
import TodoComponent from "../Todo/TodoComponent.jsx";
import CalendarComponent from "../Calendar/CalendarComponent.jsx";
import {Container, Row, Col, Spinner} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService";
import moment from "moment";
import TodoResources from "../Todo/TodoResources.js";

class AgendaComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			todos: "",
			loadedTodos: false,
		};
	}

	componentDidMount() {
		this.refresh_todos();
	}

	refresh_todos = () => {
		// Retrieves the Todos for the User from the Server
		TodoResources.retrieve_todos(this.state.username).then((response) => {
			let todos = response.data;
			
			todos.sort((a, b) => new moment(a.date) - new moment(b.date));
			this.setState({todos: todos, loadedTodos: true});
		});
	};

	render() {
		return (
			<div className="app-window">
				<h1 className="border-bottom title-header">Agenda</h1>
				<Container fluid className="window-body">
					{this.state.loadedTodos ? (
						<Row>
							<Col>
								<CalendarComponent callback={this.refresh_todos} todos={this.state.todos} />
							</Col>
							<Col>
								<TodoComponent
									callback={this.refresh_todos}
									todos={this.state.todos}
								/>
							</Col>
						</Row>
					) : (
						<Spinner animation="grow"></Spinner>
					)}
				</Container>
			</div>
		);
	}
}

export default AgendaComponent;
