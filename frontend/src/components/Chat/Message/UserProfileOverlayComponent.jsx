import React, {Component} from "react";
import {Image, Popover, Button, ButtonGroup, Container} from "react-bootstrap";
import {Link, withRouter} from "react-router-dom";
import tempImg from "../../../assests/ProfileIcon.svg";
import "./UserProfileOverlayComponent.css";
import ContactsResource from "../../Contacts/ContactsResource.js";
class UserProfileOverlayComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: props.sender.name,
			bio: props.sender.bio,
			imagePath: props.sender.imagePath,
			username: props.senderusername,
		};
		this.addContact = this.addContact.bind(this);
	}

	addContact() {
		let username = sessionStorage.getItem("authenticatedUser");
		ContactsResource.addContact(username, this.state.username);
	}
	render() {
		return (
			<Popover  id="123" {...this.props}>
				<Popover.Content
					style={{overflowY: "auto", maxHeight: "500px", minWidth: "350px"}}
					className="user-profile mb-0 bg-dark">
					<Container fluid className="text-white d-flex flex-column align-items-center">
						<Image
							className="unselectable"
							height="75px"
							width="75px"
							style={{objectFit: "cover"}}
							src={tempImg}
							roundedCircle
						/>
						<h5>
							<strong>{this.state.name}</strong>
						</h5>
						<Container fluid className="text-center pt-3">
							<h6>Bio</h6>
							<p>
								{this.state.bio ? this.state.bio : "This user has not added a bio."}
							</p>
						</Container>
					</Container>
				</Popover.Content>
				<Popover.Content style={{minWidth: "350px"}} className=" p-0">
					<ButtonGroup className="w-100">
						<Button variant="secondary" type="button" style={{ borderTopLeftRadius: "0px" }} onClick={this.addContact}>
							Add to contacts
						</Button>
						<Button as={Link} to={"/private/" + this.state.username} style={{ borderTopRightRadius: "0px" }} variant="primary" type="button">
							Private Chat
						</Button>
					</ButtonGroup>
				</Popover.Content>
			</Popover>
		);
	}
}

export default UserProfileOverlayComponent;
