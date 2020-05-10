import React, { Component } from "react";
import {Container } from "react-bootstrap"
import MessageComponent from "./Message/MessageComponent.jsx"

var messageCounter = 0;

class MessagesListComponent extends Component {

    constructor(props) {
        super(props);
        this.mapMessages = this.mapMessages.bind(this)
    }

    mapMessages() {
		let retDiv;
		messageCounter = 0;
		retDiv = this.props.messages.map((old_msg, index) => {
			messageCounter++;
			return (
				<div className="displayed-message" key={messageCounter}>
					<MessageComponent
						senderUsername={old_msg.sender}
						sender={this.props.instance_member_details.get(old_msg.sender)}
						msg={old_msg}
					/>

					{this.props.readLast === old_msg.date_time && index < this.props.oldMessageLength ? (
						<div className="d-flex justify-content-center border-bottom border-top border-danger pd-5 md-5">
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

	render() {
		return (
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

				{/* <div className="message-date">
                July 3rd 2020 at 12:30am
            </div> */}
			</Container>
		);
	}
}
export default MessagesListComponent;
