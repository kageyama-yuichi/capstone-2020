import React, {Component} from "react";
import "./TodoEditComponent.css";
import moment from "moment";
import TodoResources from "./TodoResources.js";
import {Form, Button} from "react-bootstrap";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import {TwitterPicker} from "react-color";

class TodoEditComponent extends Component {
	constructor(props) {
		super(props);

		let todo = this.props.editTodo;

		this.state = {
			id: todo.id ? todo.id : "",
			username: AuthenticationService.getLoggedInUserName(),
			desc: todo.desc ? todo.desc : "",
			date: todo.date ? todo.date : moment().format("YYYY-MM-DD"),
			descError: "", 
			dateError: "", 
			color: todo.color,
			status: todo.status ? todo.status : false,
			color: "#808080",
			displayColorPicker: false,
		};
	}

	validateForm(e) {
		const fields = this.state;

		let formIsValid = true;
		this.setState({dateError: "", descError: ""});

		let errors = {};

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
			color: this.todo.color,
			status: this.state.status,
		};

		if (this.validateForm(e)) {
			if (this.state.id) {
				this.props.updateCallback(this.state.id, todo);
			} else {
				this.props.createCallback(todo);
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

	handleColorChange = ({hex}) => {
		this.setState({color: hex});
		this.handleColorClose();
	};

	handleColorClick = () => {
		this.setState({displayColorPicker: !this.state.displayColorPicker});
	};

	handleColorClose = () => {
		this.setState({displayColorPicker: false});
	};

	render() {
		return (
			<div className="wrapper">
				<div className="bg bg-full" onClick={this.props.closeHandler}></div>
				<div className="overlay todo-overlay">
					<button className="exit-button" onClick={this.props.closeHandler}>
						X
					</button>

					<Form
						noValidate
						validated={this.state.validated}
						className="w-100 p-3"
						onSubmit={this.handleSubmit.bind(this)}>
						<h2>Create a new todo</h2>
						<Form.Group>
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
								{this.state.descError}
							</Form.Control.Feedback>
						</Form.Group>

						<Form.Group>
							<Form.Label>Date</Form.Label>
							<Form.Control
								className="date-input"
								type="date"
								name="date"
								onChange={this.handleChange.bind(this)}
								value={this.state.date}
							/>
							<Form.Control.Feedback type="invalid">
								{this.state.dateError}
							</Form.Control.Feedback>
						</Form.Group>
						<Form.Group>
							<Form.Label>Colour</Form.Label>

							<div className="d-flex">
								
								<div
									style={{backgroundColor: this.state.color}}
									onClick={this.handleColorClick}
									className="swatch"></div>
							</div>
						</Form.Group>
						<div className="d-flex align-items-center">
							{this.state.displayColorPicker ? (
								<div className="colorpicker-popover">
									<div
										className="colorpicker-cover"
										onClick={this.handleColorClose}
									/>
									<TwitterPicker
										color="#333"
										onChangeComplete={this.handleColorChange}
									/>
								</div>
							) : null}
						</div>

						<Button variant="secondary" className="w-100 p-2 save-button" type="submit">
							Save
						</Button>
					</Form>
				</div>
			</div>
		);
	}
}

export default TodoEditComponent;
