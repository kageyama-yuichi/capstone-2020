import React, {ReactDOM, Component, useRef, createRef} from "react";
import {Container, Image, OverlayTrigger, Overlay} from "react-bootstrap";
import tempImg from "../../../assests/ProfileIcon.svg";
import moment from "moment";
import UserProfileOverlayComponent from "./UserProfileOverlayComponent.jsx";
import {create} from "domain";

var target = null;

class MessageComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.msg.name,
			dateTime: moment(props.msg.date_time, "LT (DD/MM/YYYY)"),
			sender: props.msg.sender,
			message: props.msg.message,
			show: false,
			target: null,
			ref: createRef(),
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		console.log(e.target);
		target = e.target;
		this.setState({show: !this.state.show});
	}

	render() {
		console.log(this.state.ref);
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
					rootClose="true"
					overlay={<UserProfileOverlayComponent senderUsername={this.props.senderUsername} sender={this.props.sender} />}>
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
					<Container fluid className="message-header d-flex align-items-end">
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
					</Container>
					<Container fluid className="message-body">
						<h6 className="text-wrap text-muted">{this.state.message}</h6>
					</Container>
				</Container>
			</Container>
		);
	}
}

export default MessageComponent;
