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
		this.handleRemove = this.handleRemove.bind(this);
		this.handle_getContactList = this.handle_getContactList.bind(this);
	}
	
	handleRemove(contact){
		ContactsResource.remove_contact(this.state.username, contact).then((response) => {
			this.refresh_contacts();
		});
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

	handle_search_new_users = () => {
		if (this.state.search_key != "") {
			//var url = this.props.history.location.pathname;
			//var url2 = this.props.history.location.pathname + "/" + contact;
			OrgsResources.retrieve_all_basic_users_by_name(this.state.search_key).then((response) => {
				// Assign the Searched Users that Are Not in the Org to the Array
				searched_users = [];
				
				var temp = response.data.sort(this.sort_by_alphabetical_order);
				for (let i = 0; i < temp.length; i++) {
					if(this.state.username === temp[i].username) continue;
					var isAlreadyContact = false;
					for(let j = 0; j<this.state.contactList.length; j++) {
						if(this.state.contactList[j] === temp[i].username){
							isAlreadyContact = true;
							break;
						}
					}
					if(!isAlreadyContact){
						searched_users.push(temp[i]);
					}
				}
				// Re-render the Page to Display Array
				this.setState({
					search_key: "",
				});
			});
		} else {
			// Do Nothing
		}
	};
	addContact = (contact) => {
		ContactsResource.addContact(this.state.username, contact).then((response) => {
			//this.props.history.push(url)
			// Assign the Searched Users that Are Not in the Org to the Array
			searched_users = [];
			// Re-render the Page to Display Array
			this.setState({
				search_key: "",
			});
			this.refresh_contacts();
		});
	};
	
	sort_by_alphabetical_order = (a, b) => {
		const user_a_name = a.fname.toUpperCase() + " " + a.lname.toUpperCase();
		const user_b_name = b.fname.toUpperCase() + " " + b.lname.toUpperCase();

		let comparison;
		if (user_a_name > user_b_name) {
			comparison = 1;
		} else if (user_a_name < user_b_name) {
			comparison = -1;
		}
		return comparison;
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
	
	// Maps all the Searched User Buttons
	mapNonOrgUsersButtons(is_searched, username) {
		let retDiv;
		if (is_searched) {
			retDiv = (
				<Button
					key={username + "invite"}
					variant="success"
					onClick={() => this.addContact(username)}>
					<i className="fas fa-plus"></i>
				</Button>
			);
		} else {
			retDiv = (
				<Button
					key={username + "destroy"}
					variant="danger"
					onClick={() => this.remove_invited_user(this.state.org_id + "." + username)}>
					<i className="fas fa-times"></i>
				</Button>
			);
		}

		return retDiv;
	}

    render() {
		
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
							onClick={() => this.handle_getContactList(contact)}
							>
							<div className="d-flex justify-content-between">
								{contact}
								<ButtonGroup className="align-self-end">
									<Button onClick={(e) => {e.stopPropagation(); this.handleRemove(contact);}}
									 size="sm" className="float-right" variant="danger">Remove
									</Button>
								</ButtonGroup>
							</div>
							</ListGroup.Item>)
						)}
					</ListGroup>
					</Col>) : null}

					
				</Container>
			</div>
		);
	}
}

export default ContactComponent;
