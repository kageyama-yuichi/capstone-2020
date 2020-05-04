import React, {Component} from "react";
import {Button, ButtonGroup, Col, Container, FormControl, ListGroup, Row} from "react-bootstrap"; 
import ContactsResource from "./ContactsResource.js"
import OrgsResources from "../Orgs/OrgsResources.js"
import AuthenticationService from "../Authentication/AuthenticationService.js"

var searched_users = [];
var pending_users = [];
const org_member_details = new Map();

class ContactComponent extends Component {

    constructor(props) {
        super(props)
        this.state = { 
			username: AuthenticationService.getLoggedInUserName(),
			search_key: "",
			user: props.senderUsername,
            contactList: []
		}
		this.handleClick = this.handleClick.bind(this)
	}
	
	handleClick(){
		let username = sessionStorage.getItem("authenticatedUser");
		console.log(username); console.log(this.state.username); console.log(this.state.user);
		ContactsResource.remove_contact(username, "Test")
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

	handle_typing_search_key = (event) => {
		this.setState({
			search_key: event.target.value.replace(/[^a-zA-Z1-9 ']/gi, ""),
		});
	};

	handle_search_new_users = (contact) => {
		if (this.state.search_key != "") {
			var url = this.props.history.location.pathname;
			var url2 = this.props.history.location.pathname + "/" + contact;
			// Search for the Users Specified and Update Area
			let username = sessionStorage.getItem("authenticatedUser");
			console.log(username); console.log(contact);
			ContactsResource.addContact(username, "Test").then(
				
				(response) => {
					this.props.history.push(url)
					// Assign the Searched Users that Are Not in the Org to the Array
					searched_users = [];
					// Re-render the Page to Display Array
					this.setState({
						search_key: "",
					});
				}
			);
		} else {
			// Do Nothing
		}
	};

		// Maps all the Searched and Pending Users
		mapNonOrgUsers(mapper, is_searched) {
			let retDiv;
			// Ensure the Array Has Data
			if (mapper.length > 0) {
				retDiv = mapper.map((usr) => {
					return (
						<ListGroup.Item key={usr.username} className="bg-light text-dark">
							<div className="d-flex justify-content-between">
								<p>
									{usr.fname} {usr.lname}
								</p>
								<ButtonGroup className="align-self-end">
									{this.mapNonOrgUsersButtons(is_searched, usr.username)}
								</ButtonGroup>
							</div>
						</ListGroup.Item>
					);
				});
			} else {
				retDiv = null;
			}
			return retDiv;
		}
	

    render() {
        console.log("rendering contacts")
		return (
			<div className="app-window">
				<Container fluid className="h-100">
                    <h1>
					Private Chat
                    </h1>  

					<h3>Contact List</h3>
					<Row>
					<Col sm={4}>
			          <FormControl
					  className="org-new-users"
					  type="text"
					  id="search_user"
					  value={this.state.search_key}
					  onChange={this.handle_typing_search_key}
					  placeholder="Enter the User to add"
					  onKeyPress={(event) => {
						  if (event.key === "Enter") {
							  this.handle_search_new_users();
							}
						}}
						/>
						</Col>
						</Row>		
						<Row>
							<ListGroup className="org-new-users">
							{this.mapNonOrgUsers(searched_users, true)}
							</ListGroup>
						</Row>			
				{this.state.contactList.length > 0 ? (
                 <Col sm={4}>
					<ListGroup>
						{this.state.contactList.map(contact =>  (
						<ListGroup.Item key={contact} 
						onClick={() => this.handle_getContactList(contact)}action>{contact}
						
						<Button onClick={this.handleClick}
						 size="sm" className="float-right" variant="danger">Remove
						</Button>
						
						</ListGroup.Item>))}
					</ListGroup>
					</Col>) : null}

					
				</Container>
			</div>
		);
	}
}

export default ContactComponent;
