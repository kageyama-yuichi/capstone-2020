import React, {Component} from "react";
import {Container} from "react-bootstrap";

import TodoResources from "../Todo/TodoResources.js";

import {Calendar, momentLocalizer} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import equal from "fast-deep-equal";

const localizer = momentLocalizer(moment);

class CalendarComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
		};
	}

    //Formats events so they are useable by RBC
	createEvents() {
		var events = [];
		this.props.todos.map((todo) => {
			events.push({
				id: todo.id,
				title: todo.desc,
				allDay: true,
				start: todo.date,
				end: todo.date,
				status: todo.status,
			});
		});
		this.setState({events: events});
	}

	componentDidMount() {
		this.createEvents();
	}

	onSelectEvent(event) {
		this.handleDoneClick(event.id);
	}

	handleDoneClick(id) {
		TodoResources.update_todo_status(this.state.username, id).then((response) => {
			this.props.callback();
		});
	}

	//Checks if prop changed
	componentDidUpdate(prevProps) {
		if (!equal(this.props.todos, prevProps.todos)) {
			// Check if it's a new user, you can also use some unique property, like the ID  (this.props.user.id !== prevProps.user.id)
			this.createEvents();
		}
	}

	render() {
		return (
			<Container fluid>
				<Calendar
					selectable
					localizer={localizer}
					className="window-body"
					events={this.state.events}
					defaultView="month"
					defaultDate={new Date()}
					views={{month: true}}
					onSelectEvent={(event) => this.handleDoneClick(event.id)}
                    eventPropGetter={(event) => {
                        const backgroundColor = event.status ? "rgb(28, 196, 28)" : "rgb(255, 162, 162)"
                        return {style: {backgroundColor}}
                    }}
				/>
			</Container>
		);
	}
}

export default CalendarComponent;
