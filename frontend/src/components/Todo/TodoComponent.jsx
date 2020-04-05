import React, { Component } from "react";
import "./TodoComponent.css";
import moment from "moment";
import { withRouter } from "react-router-dom";

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
			done: false
		};
		this.state = {
			todos: [todo1, todo2]
		};
	}

	render() {
		return (
			<div className="todo-component">
				<div>
					<h1 style={{ height: "fit-content" }}>Todo List</h1>

                    <div className="todo-container">
						<table cellSpacing="0" className="todo-table">
							<tbody>
								{this.state.todos.map(todo => (
									<tr key={todo.id}>
										<td className="done-col">
											<button className="done-button">
												{todo.done ? "Done" : "Doing"}
											</button>
										</td>
										<td className="desc-col">{todo.description}</td>
										<td className="date-col">
											{moment(todo.targetDate).format(
												"ll"
											)}
										</td>

										<td className="update-col">
                                        <button><i className="fas fa-edit"></i></button>
										</td>
										<td className="delete-col">
                                            <button><i className="fas fa-minus-circle"></i></button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
						{/* <div className="row">
							<button
								className="btn btn-success"
								onClick={this.addTodoClicked}
							>
								Add
							</button>
						</div> */}
					</div>
				</div>
			</div>
		);
	}
}

export default TodoComponent;
