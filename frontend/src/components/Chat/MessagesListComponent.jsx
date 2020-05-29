import React, {Component} from "react";
import {Container, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import MessageComponent from "./Message/MessageComponent.jsx";

var messageCounter = 0;
var renderedNew = false;

class MessagesListComponent extends Component {
	constructor(props) {
		super(props);
		this.mapMessages = this.mapMessages.bind(this);
	}

	componentWillUnmount() {
		messageCounter = 0;
		renderedNew = false;
	}

	mapMessages() {
		let retDiv;
		messageCounter = 0;
		retDiv = this.props.messages.map((old_msg, index) => {
			messageCounter++;
			if (this.props.readLast === old_msg.date_time && index < this.props.oldMessageLength) {
				renderedNew = true;
			}

			return (
				<div className="displayed-message" key={messageCounter}>
					<MessageComponent
						senderUsername={old_msg.sender}
						sender={this.props.instance_member_details.get(old_msg.sender)}
						msg={old_msg}
					/>

					{this.props.readLast === old_msg.date_time &&
					index < this.props.oldMessageLength ? (
						<div
							id="new-div"
							className="d-flex justify-content-center border-bottom border-top border-danger pd-5 md-5">
							New
						</div>
					) : null}
				</div>
			);
		});
		this.props.setMessageCounter(messageCounter);
		return retDiv;
	}

	componentDidUpdate() {
		if (this.props.shouldScrollToBottom) {
			this.props.scrollToBottom();
		}
	}

	handleGoToNew() {
		var newDiv = document.getElementById("new-div");
		var chatDiv = document.getElementById("scrollable-chat");

		if (newDiv) {
			var elementTop = newDiv.offsetTop;
			var divTop = chatDiv.offsetTop;
			console.log(elementTop, divTop);
			chatDiv.scrollTop = elementTop - divTop;
		}
	}

	render() {
		return (
			<div className="h-100">
				<Container
					fluid
					onScroll={this.props.handleScroll}
					className="h-100 w-100 pr-0"
					id="scrollable-chat"
					style={{
						overflowY: "auto",
						overflowX: "hidden",
						wordWrap: "break-word",
					}}>
					{this.mapMessages()}
				</Container>
				{renderedNew ? (
					<OverlayTrigger
						delay={{show: 20, hide: 0}}
						placement="left"
						overlay={<Tooltip>Go to New</Tooltip>}>
						<Button
							onClick={this.handleGoToNew}
							variant="outline-secondary"
							className="mr-auto">
							<i className="fas fa-chevron-up"></i>
						</Button>
					</OverlayTrigger>
				) : null}
			</div>
		);
	}
}
export default MessagesListComponent;
