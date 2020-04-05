import React, { Component } from "react";
import "./AgendaComponent.css";
import TodoComponent from "../Todo/TodoComponent.jsx";

class AgendaComponent extends Component {
	render() {
		return (
			<div className="app-window agenda-component">
				<div className="calendar-wrapper"></div>
				<div className="todo-wrapper">
					<TodoComponent />
				</div>
			</div>
		);
	}
}

export default AgendaComponent;
