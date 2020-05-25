import React, {Component} from "react";
import TodoComponent from "../../Todo/TodoComponent.jsx";
import OrgResources from "../../Orgs/OrgsResources.js";
import TodoResources from "../../Todo/TodoResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService";
import moment from "moment";
import {Container} from "react-bootstrap"
class TodoWidgetComponent extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			personalTodos: [],
			personalTodosLoaded: false,
			teamTodos: [],
			teamTodosLoaded: false,
		};
		this.refreshOrgTodos = this.refreshOrgTodos.bind(this);
		this.refreshPersonalTodos = this.refreshPersonalTodos.bind(this);
	}

	componentDidMount() {
		this.refreshOrgTodos();
		this.refreshPersonalTodos();
	}

	refreshPersonalTodos() {
		TodoResources.retrieve_todos(this.state.username).then((response) => {
			let todayTodos = this.getTodayTodos(response.data);
			this.setState({personalTodos: todayTodos, personalTodosLoaded: true});
		});
	}

	refreshOrgTodos() {
		OrgResources.retrieveAllOrgTodos(this.state.username).then((response) => {
			let teamTodos = [];
			for (var i in response.data) {
				for (var j in response.data[i]) {
					teamTodos.push(response.data[i][j]);
				}
			}
			let todayTeamTodos = this.getTodayTodos(teamTodos);
			this.setState({teamTodos: todayTeamTodos, teamTodosLoaded: true});
		});
	}

	getTodayTodos(todos) {
		var retTodos = todos.filter((todo) => {
			return	moment(todo.date).isSame(moment(), "day");
		})
		return retTodos;
	}

	render() {
		return this.state.personalTodosLoaded && this.state.teamTodosLoaded ? (
			<div className="w-100" style={{overflowY: "auto"}}>
				{this.state.personalTodos.length > 0 ? (
					<TodoComponent
						showHeader={true}
						isWidget={true}
						title="Personal Todos"
						callback={this.refreshPersonalTodos}
						todos={this.state.personalTodos}
					/>
				) :	<Container fluid>No personal Todos!</Container>}
				{this.state.teamTodos.length > 0 ? (
					<TodoComponent
						showHeader={false}
						isWidget={true}
						showNewButton={false}
						disableDoneButton={true}
						callback={this.refreshOrgTodos}
						title="Channel Todos"
						todos={this.state.teamTodos}
					/>
				) :  <Container fluid>No channel Todos!</Container>}
			</div>
		) : null;
	}
}
export default TodoWidgetComponent;
