import React, {Component} from "react";
import TodoComponent from "../Todo/TodoComponent";
import CalendarComponent from "../Calendar/CalendarComponent";
import {Tabs, Tab} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService";
import moment from "moment";
import OrgResources from "./OrgsResources.js";

class ChannelAgendaComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgId: props.orgId,
			channelTitle: props.channelTitle,
			role: props.role,
			todos: [],
			loadedTodos: false,
		};
		this.refreshTodos = this.refreshTodos.bind(this);
	}

	componentDidMount() {
		this.refreshTodos();
	}

	componentDidUpdate(prevProps) {
        if (prevProps.channelTitle !== this.props.channelTitle) {
			this.setState({channelTitle: this.props.channelTitle, loadedTodos: false}, this.refreshTodos());
		}
	}

	refreshTodos() {
		let todos = [];
		OrgResources.retrieve_org_todos(
			this.state.username,
			this.state.orgId,
			this.state.channelTitle
		).then((response) => {
			todos = response.data;
			todos.sort((a, b) => new moment(a.date) - new moment(b.date));
			this.setState({todos: todos, loadedTodos: true});
		});
	}

	render() {
		return (
			<Tabs>
				<Tab eventKey="todo" title="Todo List">
					{this.state.loadedTodos ? (
						<TodoComponent
							callback={this.refreshTodos}
							todos={this.state.todos}
							orgId={this.state.orgId}
							channelTitle={this.state.channelTitle}
							role={this.state.role}
                            isTeamTodo={true}
                            title={<><strong>{this.state.channelTitle}'s</strong> todo list</>}
						/>
					) : null}
				</Tab>
				<Tab eventKey="calendar" title="Calendar">
					{this.state.loadedTodos ? (
						<CalendarComponent callback={this.refreshTodos} todos={this.state.todos} />
					) : null}
				</Tab>
			</Tabs>
		);
	}
}
export default ChannelAgendaComponent;
