import React, {Component} from 'react'
import TodoResources from './TodoResources.js'
import AuthenticationService from '../Authentication/AuthenticationService.js'


class AddUpdateTodoComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			old_id: this.props.match.params.id,
			username: AuthenticationService.getLoggedInUserName(),
			desc: '',
			date: (new Date().toISOString().slice(0,10)).toString(),
			desc_error: false,
			date_error: false,
		};
		this.on_submit = this.on_submit.bind(this)
	}
	
	on_submit  = () => {
		console.log(this.state.desc);
		var internal_error = false;
		var str2 = new String(this.state.desc);
		
		/* Some Sorto f Validation */
		// Ensure Length is 3 or Greater
		if(this.state.desc.length < 4) { 
			this.setState({
				desc_error: true
			})
			internal_error = true;
		}
		
		if(!internal_error) {
			var t_date = this.state.date;
			var modified_date = t_date.slice(8,10)+"/"+t_date.slice(5,7)+"/"+t_date.slice(0,4);
			console.log("System - Creating New Todo List");
			let todo = {
				username: this.state.username,
				desc: this.state.desc,
				date: modified_date,
				status: false
			}
			if(this.state.old_id === "new"){
				TodoResources.create_todo(this.state.username, todo).then(() => this.props.history.toBack());
			} else {
				TodoResources.update_todo(this.state.username, this.state.old_id, todo).then(() => this.props.history.toBack());
			}
		}
	} 
	
    handle_typing_desc = (event) => {
		this.setState({
            desc: event.target.value,
			desc_error: false
        });
	}
	handle_typing_date = (event) => {
		this.setState({
            date: event.target.value,
			date_error: false
        });
		console.log(event.target.value);
	}
	
	componentDidUpdate() {
	}

	componentDidMount() {
		console.log(this.state.date);
	}
	
	render() {
		console.log("System - Rendering Page...");
        return (
            <div className="FormOrgComponent">
				<h1>Todo Creator</h1>
				<h2>Description of Todo</h2>
				<input 
					type="text"
					name="desc"
					id="desc"
					value={this.state.desc}
					onChange={this.handle_typing_desc}
					placeholder="Description of Todo"
				/>
				<h2>Due Date</h2>
				<input 
					type="date" 
					name="due_date"
					id="due_date" 
					value={this.state.date}
					onChange={this.handle_typing_date}
				/>
				
				<input
					id="org_create"
					type="button"
					value="Submit"
					onClick={this.on_submit}
				/>
			</div>
        )
    }
}

export default AddUpdateTodoComponent
