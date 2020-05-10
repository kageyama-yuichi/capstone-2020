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
				username: todo.username,
				id: todo.id,
				title: todo.desc,
				allDay: true,
				start: todo.date,
				end: todo.date,
				status: todo.status,
				color: todo.color
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

	handleDoneClick(event) {
		if (event.username !== undefined) {
			TodoResources.update_todo_status(this.state.username, event.id).then((response) => {
				this.props.callback();
			});
		}
		
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
					onSelectEvent={(event) => this.handleDoneClick(event)}
					eventPropGetter={(event) => {
						console.log(event)
						const style = {
							backgroundColor: event.status ? event.color : "white",
							color: event.status ? "white" : "darkgray",
							border: "3px solid black",
							borderColor: event.status ? "darkgray" : event.color,
						}

                        return {style: style}
                    }}
				/>
			</Container>
		);
	}
}

export default CalendarComponent;
