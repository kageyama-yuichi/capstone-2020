import React, {Component} from "react";
import {Button, Container, ListGroup} from "react-bootstrap"; 
import ContactsResource from "./ContactsResource.js"
import AuthenticationService from "../Authentication/AuthenticationService.js"

class ContactComponent extends Component {

    constructor(props) {
        super(props)
        this.state = { 
			username: AuthenticationService.getLoggedInUserName(),
            contactList: []
        }
    }

	refresh_contacts = () => {
		// Retrieves the Contacts for the Organisation Channels
		ContactsResource.getContactList(this.state.username).then((response) => {
			this.setState({contactList: response.data});
		});
	}
	
	componentDidMount() {
		this.refresh_contacts();
	}

	handle_getContactList = (contact) => {
		var url = this.props.history.location.pathname + "/" + contact;
		this.props.history.push(url);
	};
  

    render() {
        console.log("rendering contacts")
		return (
			<div className="app-window">
				<Container fluid className="h-100">
                    <h1>
					Private
                    </h1>  

					<h3>Contact List</h3>

					{this.state.contactList.length > 0 ? (<ListGroup>
						{this.state.contactList.map(contact =>  (<ListGroup.Item key={contact} onClick={() => this.handle_getContactList(contact)}action>{contact}</ListGroup.Item>))}
					</ListGroup>) : null}
				</Container>
			</div>
		);
	}
}

export default ContactComponent;
