import React, { Component } from "react";
import "./TodoComponent.css";
import moment from "moment";
import TodoEditComponent from "./TodoEditComponent.jsx";

class TodoComponent extends Component {
	constructor(props) {
		super(props);

		//Mock data
		let todo1 = {
			id: 1,
			description: "this is todo 1",
			targetDate: moment.now(),
			done: false
		};
		let todo2 = {
			id: 2,
			description: "this is todo 2",
			targetDate: moment.now(),
			done: true
		};
		this.state = {
			todos: [todo1, todo2],
			showOverlay: false
		};

		this.handleEditClick = this.handleEditClick.bind(this);
	}

	getTodo(key) {
		const todos = this.state.todos;
		for (let i = 0; i < todos.length; i++) {
			if (todos[i].id == key) {
				return i;
			}
		}
	}

	handleEditClick() {
		this.setState({ showOverlay: !this.state.showOverlay });
	}

	handleDoneClick(key) {
		const index = this.getTodo(key);
		this.state.todos[index].done = !this.state.todos[index].done;
		this.forceUpdate();
	}


	//TODO: Add confirmation
	handleDeleteClick(key) {
		if (window.confirm("Delete todo?")) {
			const index = this.getTodo(key);
			const todos = this.state.todos;
			todos.splice(index, 1);
			this.setState({ todos: todos });
		}
	}

	render() {
		return (
			<div className="todo-component">
				<div>
					<div className="todo-header">
						<h1 style={{ height: "fit-content" }}>Todo List</h1>
						<button
							className="new-todo-button"
							onClick={this.handleEditClick}
						>
							New Todo
						</button>
					</div>

					<div className="todo-container">
						<table cellSpacing="0" className="todo-table">
							<tbody>
								{this.state.todos.map(todo => (
									<tr key={todo.id}>
										<td className="done-col">
											<button
												className={
													todo.done
														? "done-button"
														: "doing-button"
												}
												onClick={() =>
													this.handleDoneClick(
														todo.id
													)
												}
											>
												{todo.done ? "Done" : "Doing"}
											</button>
										</td>
										<td className="desc-col">
											{todo.description}
										</td>
										<td className="date-col">
											{moment(todo.targetDate).format(
												"ll"
											)}
										</td>

										<td className="update-col">
											<button>
												<i className="fas fa-edit"></i>
											</button>
										</td>

										<td className="delete-col">
											<button
												onClick={() =>
													this.handleDeleteClick(
														todo.id
													)
												}
											>
												<i className="fas fa-minus-circle"></i>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{this.state.showOverlay ? (
                            <TodoEditComponent closeHandler={this.handleEditClick} />
						) : null}
					</div>
				</div>
			</div>
		);
	}
}

export default TodoComponent;
