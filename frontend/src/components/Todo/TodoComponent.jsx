import React, {Component} from "react";
import TodoResources from "./TodoResources.js";
import OrgResources from "../Orgs/OrgsResources.js";
import "./TodoComponent.css";
import moment from "moment";
import TodoEditComponent from "./TodoEditComponent.jsx";
import {Container, Button} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import equal from "fast-deep-equal";

//TODO: remove todos that have a date that is in the past.
//		should probably do this in backend when getting the todos
class TodoComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			todos: props.todos ? props.todos : [],
			orgId: props.isTeamTodo ? props.orgId : "",
			channelTitle: props.isTeamTodo ? props.channelTitle : "",
			showOverlay: false,
			editTodo: "",
		};
		this.toggleOverlay = this.toggleOverlay.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleEditClick = this.handleEditClick.bind(this);
		this.handleCreateClick = this.handleCreateClick.bind(this);
		this.handleCreateCallback = this.handleCreateCallback.bind(this);
		this.handleUpdateCallback = this.handleUpdateCallback.bind(this);
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
		if (this.props.isTeamTodo) {
			OrgResources.update_org_todo_status(
				this.state.username,
				this.state.org_id,
				this.state.channel_title,
				id
			).then((response) => {
				this.refresh_todos();
			});
		} else {
			TodoResources.update_todo_status(this.state.username, id).then((response) => {
				this.refresh_todos();
			});
		}
	}

	handleDeleteClick = (id) => {
		if (this.props.isTeamTodo) {
			OrgResources.delete_org_todo(
				this.state.username,
				this.state.org_id,
				this.state.channel_title,
				id
			).then(() => {
				this.refresh_todos();
			});
		} else {
			TodoResources.delete_todo(this.state.username, id).then((response) => {
				// Reset using this.refresh_todos in Callback to Force
				this.refresh_todos();
			});
		}
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

	handleUpdateCallback(id, todo) {
		if (this.props.isTeamTodo) {
			OrgResources.update_org_todo(
				this.state.username,
				this.state.orgId,
				this.state.channelTitle,
				id,
				todo
			).then(() => this.saveCallback());
		} else {
			TodoResources.update_todo(this.state.username, this.state.id, todo).then(() =>
				this.saveCallback()
			);
		}
	}

	handleCreateCallback(todo) {
		if (this.props.isTeamTodo) {
			OrgResources.create_org_todo(
				this.state.username,
				this.state.orgId,
				this.state.channelTitle,
				todo
			).then(() => this.saveCallback());
		} else {
			TodoResources.create_todo(this.state.username, todo).then(() => this.saveCallback());
		}
	}

	componentDidUpdate(prevProps) {
		if (!equal(this.props.todos, prevProps.todos)) {
			// Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
			this.setState({todos: this.props.todos});
		}
	}

	getTodos() {
		let todos = [];

		TodoResources.retrieve_todos(this.state.username).then((response) => {
			todos = response.data;
			todos.sort((a, b) => new moment(a.date) - new moment(b.date));

			this.setState({todos: todos});
		});
	}

	refresh_todos = () => {
		if (this.props.callback) {
			this.props.callback();
		} else {
			this.getTodos();
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
					<div className="d-flex border-bottom w-100 justify-content-between">
						<h3>{this.props.title}</h3>

						{this.props.role === "TEAM_MEMBER" || !this.props.showNewButton ? null : (
							//Team members cannot add todos

							<Button
								className="align-self-baseline"
								variant="outline-primary"
								onClick={this.handleCreateClick}>
								New Todo
							</Button>
						)}
					</div>
					{this.state.todos.length > 0 ? (
						<div
							style={
								this.props.isWidget
									? {}
									: {height: "calc(100vh - 92px)", overflowY: "auto"}
							}>
							<table cellSpacing="0" className="todo-table">
								<tbody>
									{this.state.todos.map((todo) => (
										<tr key={todo.id}>
											<td style={{width: "50px"}} className="done-col">
												<button
													className={
														todo.status ? "done-button" : "doing-button"
													}
													style={{outline: "none", whiteSpace: "nowrap"}}
													onClick={() => this.handleDoneClick(todo.id)}
													disabled={
														this.props.role === "TEAM_MEMBER" ||
														this.props.disableDoneButton
													}>
													{todo.status ? "Done" : "Doing"}
												</button>
											</td>
											<td className="desc-col">{todo.desc}</td>
											<td className="date-col">
												{moment().isSame(todo.date, "date")
													? "Today"
													: moment(todo.date).format("ll")}
											</td>
											{this.props.isWidget ||
											this.props.role === "TEAM_MEMBER" ? null : (
												<td className="update-col">
													<button
														onClick={() => this.handleEditClick(todo)}>
														<i className="fas fa-edit"></i>
													</button>
												</td>
											)}
											{this.props.isWidget ||
											this.props.role === "TEAM_MEMBER" ? null : (
												<td className="delete-col">
													<button
														onClick={() =>
															this.handleDeleteClick(todo.id)
														}>
														<i className="fas fa-minus-circle"></i>
													</button>
												</td>
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : null}
					{this.state.showOverlay ? (
						<TodoEditComponent
							closeHandler={this.toggleOverlay}
							updateCallback={this.handleUpdateCallback}
							createCallback={this.handleCreateCallback}
							saveCallback={this.saveCallback}
							editTodo={this.state.editTodo}
						/>
					) : null}
				</Container>
			</div>
		);
	}
}
TodoComponent.defaultProps = {
	isTeamTodo: false,
	isWidget: false,
	title: "Todo List",
	showNewButton: true,
	disableDoneButton: false,
};

export default TodoComponent;
