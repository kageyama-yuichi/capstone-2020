import React, { Component, createRef, ReactDOM} from "react";
import {Container, Image, OverlayTrigger} from "react-bootstrap";
import tempImg from "../../../assests/ProfileIcon.svg";
import moment from "moment";
import UserProfileOverlayComponent from "./UserProfileOverlayComponent.jsx";
import AuthenticationService from "../../Authentication/AuthenticationService";

var target = null;

class MessageComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			name: props.msg.name,
			dateTime: moment(props.msg.date_time, "LT (DD/MM/YYYY)"),
			sender: props.msg.sender,
			message: props.msg.message,
			show: false,
			ref: createRef(),
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		target = e.target;
		this.setState({show: !this.state.show});
	}

	render() {
		return (
			<Container fluid className="pt-2 pb-2 d-flex">
				<div ref="target">
					<div ref="container"></div>
				</div>
				<OverlayTrigger
					show={this.state.show}
					target={() => {
						return ReactDOM.findDOMNode(this.refs.target);
					}}
					className="unselectable"
					placement="right"
					trigger="click"
					rootClose={true}
					overlay={
						<UserProfileOverlayComponent
							renderButtons={this.state.username !== this.props.senderUsername}
							senderusername={this.props.senderUsername}
							sender={this.props.sender}
						/>
					}>
					<a
						className="unselectable"
						style={{userSelect: "none", userDrag: "none"}}
						onClick={this.handleClick}
						href="#">
						<Image
							className="unselectable"
							height="50px"
							width="50px"
							style={{objectFit: "cover"}}
							src={tempImg}
							roundedCircle
						/>
					</a>
				</OverlayTrigger>
				<Container fluid className="pl-0">
					<Container fluid className="message-header d-flex justify-content-between">
						<div className="d-flex align-items-end">
							<h5>{this.state.name}</h5>
							<h6>
								<small className="pl-1 text-muted">
									@{this.state.sender}{" "}
									{this.state.dateTime.format(
										this.state.dateTime.isSame(moment(), "d")
											? "[Today] [at] LT"
											: "ll [at] LT"
									)}
								</small>
							</h6>
						</div>
						<i
							style={{transform: "rotate(45deg)"}}
							className="pl-2 align-self-center fas fa-thumbtack text-secondary"></i>
					</Container>
					<Container fluid className="message-body">
						<h6 className="text-wrap text-muted pr-5 mr-5">{this.state.message}</h6>
					</Container>
				</Container>
			</Container>
		);
	}
}

export default MessageComponent;
