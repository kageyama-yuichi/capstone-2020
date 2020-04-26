import React, {Component} from "react";
import "./AgendaComponent.css";
import AgendaTodoComponent from "../Todo/AgendaTodoComponent.jsx";
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
		console.log("called");
		this.setState({
			todos: [],
		});
		// Retrieves the Todos for the User from the Server
		TodoResources.retrieve_todos(this.state.username).then((response) => {
			let todos = [];
			// Maps the Response Data (Todo.class) to JSObject
			for (let i = 0; i < response.data.length; i++) {
				todos.push({
					id: response.data[i].id,
					username: response.data[i].username,
					desc: response.data[i].desc,
					date: response.data[i].date,
					status: response.data[i].status,
				});
			}
			todos.sort((a, b) => new moment(a.date) - new moment(b.date));
			this.setState({todos: todos, loadedTodos: true});
		});
		this.forceUpdate();
	};

	render() {
		return (
			<div className="app-window">
				<Container fluid>
					{this.state.loadedTodos ? (
						<Row>
							<Col>
								<CalendarComponent callback={this.refresh_todos} todos={this.state.todos} />
							</Col>
							<Col>
								<AgendaTodoComponent
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
