import React, {Component} from "react";
import TodoResources from "./TodoResources.js";
import "./TodoComponent.css";
import moment from "moment";
import TodoEditComponent from "./TodoEditComponent.jsx";

class TodoComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: localStorage.getItem("username"),
			todos: [],
			showOverlay: false,
			editTodo: "",
		};
		this.toggleOverlay = this.toggleOverlay.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleEditClick = this.handleEditClick.bind(this);
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
		console.log(this.state.username);
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

	componentDidUpdate() {
		//console.log(this.state.todos);
	}

	refresh_todos = () => {
		this.setState({
			todos: [],
		});
		// Retrieves the Todos for the User from the Server
		TodoResources.retrieve_todos(this.state.username).then((response) => {
			console.log(response.data);
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
	};

	componentDidMount() {
		this.refresh_todos();
	}

	render() {
		return (
			<div className="todo-component">
				<div>
					<div className="todo-header">
						<h1 style={{height: "fit-content"}}>Todo List</h1>
						<button className="new-todo-button" onClick={this.toggleOverlay}>
							New Todo
						</button>
					</div>

					<div className="todo-container">
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
											
											{moment().isSame(todo.date,'date') ? "Today" : moment(todo.date).format("ll")}
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
				</div>
			</div>
		);
	}
	// render() {
	// 	console.log("System - Rendering Page...");
	//     return (
	//         <div className="todo-component">
	// 			<h1>{this.state.username}'s Todos</h1>
	// 			<input
	// 				className="new_todo"
	// 				type="button"
	// 				value="+"
	// 				onClick={this.handle_create_todo}
	// 			/>
	// 			{this.state.todos.map(todo =>
	// 				<div key={todo.id} className='todos'>
	// 					<input
	// 						className="delete_todo"
	// 						type="button"
	// 						value="-"
	// 						onClick={() => this.handle_delete_todo(todo.id)}
	// 					/>
	// 					<input
	// 						className="update_todo"
	// 						type="button"
	// 						value="#"
	// 						onClick={() => this.handle_update_todo(todo.id)}
	// 					/>
	// 					<p key={todo.id}>{todo.desc}, {todo.status.toString()}, {todo.date}</p>
	// 				</div>
	// 			)}
	// 		</div>
	//     )
	// }
}

export default TodoComponent;
