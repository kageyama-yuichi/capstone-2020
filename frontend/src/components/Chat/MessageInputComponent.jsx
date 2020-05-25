import React, {Component} from "react";
import {Button} from "react-bootstrap"
class MessageinputComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			is_typing: false,
        };
        this.handleSendMessage = this.handleSendMessage.bind(this);
	}

	handle_typing = (event) => {
		this.setState({
			message: event.target.value,
		});

		// Check if the Value was Empty
		if (event.target.value === "") {
			// Set the is_typing boolean to false
			this.setState({
				is_typing: false,
			});
			// Send a Message to the Server that User Stopped
			this.props.send_message("TYPING", "Stopped Typing");
		} else {
			// If the User was Not Typing, Set it to They Are
			if (this.state.is_typing === false) {
				this.setState({
					is_typing: true,
				});
				// Send the Message off and Save if not "Started Typing"
				this.props.send_message("TYPING", "Started Typing");
			}
		}
	};

	handleSendMessage() {
		this.props.handleSendMessage(this.state.message);
		this.setState({message: ""});
	}

    
	render() {
		return (
			<div className="d-flex flex-row justify-content-center">
				<input
					className="form-control rounded-left w-75"
					type="msg"
                    id="msg"
                    autoComplete="off"
					style={{borderRadius: "0px"}}
					placeholder="Enter Message"
					onChange={this.handle_typing}
					value={this.state.message}
					onKeyPress={(event) => {
						if (event.key === "Enter") {
							this.handleSendMessage();
						}
					}}
				/>
				<Button
					type="button"
					variant="secondary"
					style={{borderRadius: "0px"}}
					className="rounded-right"
					onClick={this.handleSendMessage}>
					SEND
				</Button>
			</div>
		);
	}
}
export default MessageinputComponent;
