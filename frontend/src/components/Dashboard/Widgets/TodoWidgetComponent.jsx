import React, {Component} from "react";
import TodoComponent from "../../Todo/TodoComponent.jsx";
import OrgResources from "../../Orgs/OrgsResources.js";
import TodoResources from "../../Todo/TodoResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService";
import moment from "moment";
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
		this.refreshPersonalTodos = this.refreshPersonalTodos.bind(this)
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
			console.log(response.data)
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
		for (var i in todos) {
			console.log(moment().isSame(todos[i].date, "day"));
			if (!moment().isSame(todos[i].date, "day")) {
				todos.splice(i, 1);
			}
		}
		return todos;
	}

	render() {
		return this.state.personalTodosLoaded && this.state.teamTodosLoaded ? (
			<div className="w-100" style={{overflowY: "auto"}}>
				<TodoComponent showHeader={true} isWidget={true} title="Personal Todos" callback={this.refreshPersonalTodos} todos={this.state.personalTodos} />
                
                <TodoComponent showHeader={false} isWidget={true} showNewButton={false} disableDoneButton={true} callback={this.refreshOrgTodos} title="Channel Todos" todos={this.state.teamTodos}/>
			</div>
		) : null;
	}
}
export default TodoWidgetComponent;
