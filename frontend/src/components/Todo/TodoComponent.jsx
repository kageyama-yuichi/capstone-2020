import React, {Component} from 'react'
import TodoResources from './TodoResources.js'
import './TodoComponent.css'

class TodoComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: this.props.match.params.username,
			todos: []
		};
		this.handle_create_todo = this.handle_create_todo.bind(this);
		this.handle_delete_todo = this.handle_delete_todo.bind(this);
		this.handle_update_todo = this.handle_update_todo.bind(this);
	}

	handle_create_todo = () => {
		var url = this.props.history.location.pathname+'/new';
		this.props.history.push(url);
	}
	handle_delete_todo = (id) => {
		TodoResources.delete_todo(this.state.username, id).then(
			response => {
				// Reset using this.refresh_todos in Callback to Force
				this.setState({
					todos: []
				}, () => {
					this.refresh_todos();
				})
			}
		);
	}
	handle_update_todo = (id) => {
		var url = this.state.username+"/"+id;
		this.props.history.push(url);
	}
	
	componentDidUpdate() {
		console.log(this.state.todos);
	}
	
	refresh_todos = () => {
		this.setState({
			todos: []
		})
		// Retrieves the Todos for the User from the Server
		TodoResources.retrieve_todos(this.state.username)
		.then(response => 
		{
			console.log(response.data);
			// Maps the Response Data (Todo.class) to JSObject
			for(let i=0; i<response.data.length; i++){
				this.state.todos.push({
					id: response.data[i].id,
					username: response.data[i].username,
					desc: response.data[i].desc,
					date: response.data[i].date,
					status: response.data[i].status
				})
				this.setState({
					todos: this.state.todos
				})
			}
		});
	}
	
	componentDidMount() {
		this.refresh_todos();
	}
	
	render() {
		console.log("System - Rendering Page...");
        return (
            <div className="TodoComponent">
				<h1>{this.state.username}'s Todos</h1>
				<input
					className="new_todo"
					type="button"
					value="+"
					onClick={this.handle_create_todo}
				/>
				{this.state.todos.map(todo =>
					<div key={todo.id} className='todos'>
						<input
							className="delete_todo"
							type="button"
							value="-"
							onClick={() => this.handle_delete_todo(todo.id)}
						/>
						<input
							className="update_todo"
							type="button"
							value="#"
							onClick={() => this.handle_update_todo(todo.id)}
						/>
						<p key={todo.id}>{todo.desc}, {todo.status.toString()}, {todo.date}</p>
					</div>
				)}
			</div>
        )
    }
}

export default TodoComponent
