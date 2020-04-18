import React, { Component } from "react";
import "./TodoEditComponent.css";
import moment from "moment";
import TodoResources from './TodoResources.js'
import AuthenticationService from '../Authentication/AuthenticationService.js'



class TodoEditComponent extends Component {

    constructor(props) {
        super(props);

        let todo = this.props.editTodo;
        if (todo.length == 0) {
            
            this.state = {
                id: "",
                username: AuthenticationService.getLoggedInUserName(),
                desc: "",
                date: "",
                descError: "",
                dateError: "",
                status: false
            }
        } else {
            this.state = {
                id: todo.id,
                username: AuthenticationService.getLoggedInUserName(),
                desc: todo.desc,
                date: todo.date,
                descError: "",
                dateError: "",
                status: todo.status
            }
        }
        
    }

    validateForm() {

        const fields = this.state;

        let formIsValid = true;
        this.setState({ dateError: "", descError: "" });

        if (!fields.desc) {
            formIsValid = false;
            this.setState({descError: "Description cannot be empty"})
        }

        if (!fields.date) {
            formIsValid = false;
            this.setState({dateError: "Date cannot be empty"})
        } else if (moment().isAfter(this.state.date,'date')) {
            formIsValid = false;
            this.setState({dateError: "Date cannot be in the past"})            
        }

        return formIsValid;
        
    }

    //TEMP: Submit currently closes overlay
    handleSubmit(e) {
        e.preventDefault();

        let todo = {
            username: this.state.username,
            desc: this.state.desc,
            date: this.state.date,
            status: this.state.status
        }

        if (this.validateForm()) {

            if (this.state.id) {
                TodoResources.update_todo(this.state.username, this.state.id, todo).then(() => this.props.saveCallback());
            } else {
                TodoResources.create_todo(this.state.username, todo).then(() => this.props.saveCallback());
            }
        } 
    }

    handleChange(event) {
		const { name: fieldName, value } = event.target;
		this.setState({
			[fieldName]: value
		});
	}

	render() {
		return (
			<div className="wrapper">
				<div className="bg" onClick={this.props.closeHandler}></div>

				<div className="overlay todo-overlay">
					<button
						className="exit-button"
						onClick={this.props.closeHandler}
					>
						X
					</button>

                    <form className="todo-form" onSubmit={this.handleSubmit.bind(this)}>    
                        <h2>Create a new todo</h2>
                        <div className="group">
                            
							<label>Description</label>
							<input
								className="desc-input"
								type="text"
								name="desc"
                                placeholder="Enter a description"
                                onChange={this.handleChange.bind(this)}
                                value={this.state.desc}
                            />
                            <label className="error-label">{this.state.descError}</label> 
                        </div>
                        
						<div className="group">
							<label>Date</label>
							<input
								className="date-input"
								type="date"
                                name="date"
                                onChange={this.handleChange.bind(this)}
                                value={this.state.date}
                            />
                            <label className="error-label">{this.state.dateError}</label>
						</div>

						<button className="save-button" type="submit">
							Save
						</button>
					</form>
				</div>
			</div>
		);
	}
}

export default TodoEditComponent;
