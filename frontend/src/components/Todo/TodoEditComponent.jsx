import React, {Component} from "react";
import "./TodoEditComponent.css";
import moment from "moment";
import TodoResources from './TodoResources.js'
import {Form, Button, Container} from "react-bootstrap";
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

	validateForm(e) {
		const fields = this.state;

		let formIsValid = true;
		this.setState({dateError: "", descError: ""});

		let errors = new Object();

		if (!fields.desc) {
			errors.desc = "Description cannot be empty";
		}

		if (!fields.date) {
			errors.date = "Date cannot be empty";
		} else if (moment().isAfter(this.state.date, "date")) {
			errors.date = "Date cannot be in the past";
		}

		let form = e.currentTarget;

		var formControl = Array.prototype.slice.call(form.querySelectorAll(".form-control"));

		//Iterate over input fields and get corresponding error
		//Flag form as invalid if there is an error
		formControl.forEach((ele) => {
			if (errors[ele.name]) {
				formIsValid = false;
				ele.setCustomValidity("invalid");
			} else {
				ele.setCustomValidity("");
			}
		});

		this.setState({errors: errors});

		return formIsValid;
	}
	//TEMP: Submit currently closes overlay
	handleSubmit(e) {
		e.preventDefault();
		let todo = {
			username: this.state.username,
			desc: this.state.desc,
			date: this.state.date,
			status: this.state.status,
		};

		if (this.validateForm(e)) {
			if (this.state.id) {
				TodoResources.update_todo(this.state.username, this.state.id, todo).then(() =>
					this.props.saveCallback()
				);
			} else {
				TodoResources.create_todo(this.state.username, todo).then(() =>
					this.props.saveCallback()
				);
			}
		}
		this.setState({validated: true});
	}

	handleChange(event) {
		const {name: fieldName, value} = event.target;
		this.setState({
			[fieldName]: value,
		});
	}

	render() {
		return (
			<div className="wrapper">
				<div className="bg" onClick={this.props.closeHandler}></div>

				<div className="overlay todo-overlay">
					<button className="exit-button" onClick={this.props.closeHandler}>
						X
					</button>

					<Form
						noValidate
						validated={this.state.validated}
						className="todo-form"
						onSubmit={this.handleSubmit.bind(this)}>
						<h2>Create a new todo</h2>
						<Form.Group className="group">
							<Form.Label>Description</Form.Label>
							<Form.Control
								className="desc-input"
								type="text"
								name="desc"
								placeholder="Enter a description"
								onChange={this.handleChange.bind(this)}
								value={this.state.desc}
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.errors.desc}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="group">
							<Form.Label>Date</Form.Label>
							<Form.Control
								className="date-input"
								type="date"
								name="date"
								onChange={this.handleChange.bind(this)}
								value={this.state.date}
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.errors.date}
							</Form.Control.Feedback>
						</Form.Group>

						<Button variant="secondary" className="save-button" type="submit">
							Save
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default TodoEditComponent;
