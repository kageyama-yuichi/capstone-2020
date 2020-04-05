import React, { Component } from "react";
import "./TodoEditComponent.css";
import moment from "moment";

class TodoEditComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            description: "",
            date: "",
            descError: "",
            dateError: ""
        }
    }

    validateForm() {
        const fields = this.state;

        let formIsValid = true;
        this.setState({ dateError: "", descError: "" });

        if (!fields.description) {
            formIsValid = false;
            this.setState({descError: "Description cannot be empty"})
        }

        if (!fields.date) {
            formIsValid = false;
            this.setState({dateError: "Date cannot be empty"})
        } else if (moment(moment.now()).isAfter(this.state.date)) {
            formIsValid = false;
            this.setState({dateError: "Date cannot be in the past"})            
        }

        return formIsValid;
        
    }

    //TEMP: Submit currently closes overlay
    handleSubmit(e) {
        e.preventDefault();

        if (this.validateForm()) {
            this.props.closeHandler();
        } else {
            console.log("error");
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
								name="description"
                                placeholder="Enter a description"
                                onChange={this.handleChange.bind(this)}
                                value={this.state.description}
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
