import React, {Component} from "react";
import TodoResources from "./TodoResources.js";
import "./TodoComponent.css";
import moment from "moment";
import TodoEditComponent from "./TodoEditComponent.jsx";
import {Container, Button} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import equal from 'fast-deep-equal'


class TodoComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			todos: props.todos ? props.todos : [],
			showOverlay: false,
			editTodo: "",
		};
		this.toggleOverlay = this.toggleOverlay.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleCreateClick = this.handleCreateClick.bind(this);
	}

	toggleOverlay = () => {
		// var url = this.state.username + "/new";
		// this.props.history.push(url);
		this.setState({showOverlay: !this.state.showOverlay});
	};

	saveCallback = () => {
		this.toggleOverlay();
		this.refresh_todos();
	};

	handleDoneClick(id) {
		TodoResources.update_todo_status(this.state.username, id).then((response) => {
			this.refresh_todos();
		});
	}

	handleDeleteClick = (id) => {
		TodoResources.delete_todo(this.state.username, id).then((response) => {
			// Reset using this.refresh_todos in Callback to Force
			this.refresh_todos();
		});
	};
	handleEditClick = (todo) => {
		this.setState({editTodo: todo});
		this.toggleOverlay();
		// var url = this.state.username + "/" + id;
		// this.props.history.push(url);
	};

	handleCreateClick() {
		this.setState({editTodo: ""});
		this.toggleOverlay();
	}

	componentDidUpdate(prevProps) {
		if (!equal(this.props.todos, prevProps.todos)) {
			// Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
			this.setState({todos: this.props.todos})
		}
	}

	refresh_todos = () => {
		if (this.props.callback) { 
			this.props.callback()
		}else{
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
				this.setState({ todos: todos });
			});
			this.forceUpdate();
		}
	};

	componentDidMount() {
		this.refresh_todos();
	}

	render() {
		return (
			<div className="todo-component">
				<Container fluid>
					<div className="d-flex title-header border-bottom mb-3 w-100 justify-content-between">
						<h1 style={{height: "fit-content"}}>Todo List</h1>

						<Button className="align-self-center" variant="outline-primary" onClick={this.handleCreateClick}>
							New Todo
						</Button>
					</div>

					{/* <Col style={{height: "100%"}} style={{whiteSpace: "nowrap"}} className="justify-content-end"> */}

					<div className="window-body todo-container">
						<table cellSpacing="0" className="todo-table">
							<tbody>
								{this.state.todos.map((todo) => (
									<tr key={todo.id}>
										<td className="done-col">
											<button
												className={
													todo.status ? "done-button" : "doing-button"
												}
												onClick={() => this.handleDoneClick(todo.id)}>
												{todo.status ? "Done" : "Doing"}
											</button>
										</td>
										<td className="desc-col">{todo.desc}</td>
										<td className="date-col">
											{moment().isSame(todo.date, "date")
												? "Today"
												: moment(todo.date).format("ll")}
										</td>

										<td className="update-col">
											<button onClick={() => this.handleEditClick(todo)}>
												<i className="fas fa-edit"></i>
											</button>
										</td>

										<td className="delete-col">
											<button onClick={() => this.handleDeleteClick(todo.id)}>
												<i className="fas fa-minus-circle"></i>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{this.state.showOverlay ? (
							<TodoEditComponent
								closeHandler={this.toggleOverlay}
								saveCallback={this.saveCallback}
								editTodo={this.state.editTodo}
							/>
						) : null}
					</div>
				</Container>
			</div>
		);
	}
	
}

export default TodoComponent;
