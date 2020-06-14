import React, {Component} from 'react'
import { API_URL } from '../../Constants'
import AuthenticationService from '../Authentication/AuthenticationService.js'
import  './PrivateChatComponent.css'
import Encryption from './Encryption.js';
import {Container, Row, Col, Button} from "react-bootstrap";
import MessageComponent from "./Message/MessageComponent.jsx"

var stompClient = null;
var receiver = null;
var extension = null;
var counter = 0;
var messageCounter = 0;
var messages = [];
const member_details = new Map();

class PrivateChatComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			channelConnected: false,
			receiver_name: "",
			message: "",
			error: "",
			
			joined: false,
			current_time: "",
			openMembers: false,
			isTyping: false,
			bottom: true,
		};
	}
	
	// Function to Connect the User to the Server
	myConnect = () => {
		receiver = this.props.match.params.receiver;
		// Creates the Unique Extension URL for The 2 Users
		this.state.username < receiver ? 
			extension = "/" + this.state.username + "/" + receiver : 
			extension = "/" + receiver + "/" + this.state.username;

		// Create the Socket
		const Stomp = require('stompjs')
		var SockJS = require('sockjs-client')
		var socket = new SockJS(API_URL+'/chat')
		stompClient = Stomp.over(socket);
		// Disables Console Messages
		stompClient.debug = null
		// Connect the User
		stompClient.connect({}, this.onConnected, this.onError);		
	};
	
	// Subscribe the User to the Private Chat and Send the Server Notification of User
	onConnected = () => {
		this.setState({
		  channelConnected: true
		})
		
		// Subscribe to Fetching History
		// This has changed to Subscribe based on your Username so that the other person
		// messages are not given to you on load. This will also allow for later chat loads 
		// e.g., load 20 per page and then using javascript .unshift() push the new chat		
		stompClient.subscribe("/private/members" + extension + "/" + this.state.username, this.onMembersReceived, {});
		stompClient.subscribe('/private/history' + extension + "/" + this.state.username, this.onHistoryReceived, {});
		// Subscribing to the Private Chat
		stompClient.subscribe('/private/reply' + extension, this.onMessageReceived, {});
		// Subscribe to the Join and Leave for Live Feedback
		stompClient.subscribe("/online", this.onChannelConnect, {});
		this.fetchPrivateMembers();
	};
	
	// Send Messages to the Server
	sendMessage = (type, value) => {
		var valid_message = true;
		if (stompClient) {
			if(value === "")
				valid_message = false;
			else {
				var message = {
					sender: this.state.username,
					receiver: receiver,
					content: type === 'TYPING' ? value : Encryption.encrpyt_message(value),
					type: type
				};
			}
			// Send Public Message
			if(valid_message){
				stompClient.send("/app/send_private_message" + extension, {}, JSON.stringify(message));
			}
		}
	};

	// Handles Chat History
	onHistoryReceived = (payload) => {
		var obj = JSON.parse(payload.body);
		// Iterate over 
		for (let i = obj.length-1; i >= 0; i--) {
			// Use Unshift to Push objects from back to front
			messages.unshift({
				message: Encryption.decrypt_message(obj[i].content),
				sender: obj[i].sender,
				receiver: obj[i].receiver,
				name: member_details.get(obj[i].sender).name,
				date_time: obj[i].date_time,
			});
			counter++;
		}
		// Might need to Change this so that we can load e.g., 20 Messages per Request
		stompClient.unsubscribe("/private/history" + extension + "/" + this.state.username, {});
		if(!this.state.joined){
			// Registering user to server as a Private User
			stompClient.send("/app/existing_private_user", {}, JSON.stringify({ type: 'JOIN', sender: this.state.username }))
			this.setState({
				joined: true
			});
		}
	};
	
	// Handles Member Loading
	onMembersReceived = (payload) => {
		var obj = JSON.parse(payload.body);
		var does_exist = false;

		// Go through Server Message and Extract Users
		for (let i = 0; i < obj.length; i++) {
			// Checks if the User Exists
			does_exist = member_details.has(obj[i].username);
		
			if (!does_exist) {
				// Used for Storing in the Map
				let user_details = {
					status: obj[i].status,
					role: obj[i].role,
					fname: obj[i].fname,
					lname: obj[i].lname,
					name: obj[i].fname + " " +obj[i].lname,
					bio: obj[i].bio,
					image_path: obj[i].image_path,
					date_time: "",
				}
				// Set Receiver State
				if(obj[i].username !== this.state.username) {
					this.setState({
						receiverName: user_details.name,
					})
				}
				// Add them to the Members
				member_details.set(obj[i].username, user_details);
			}
		}
		
		// Unsubscribe from Retrieving Members for Server Stability 
		stompClient.unsubscribe("/private/members" + extension + "/" + this.state.username, {});
		// Now Fetch the Private History
		return this.fetchPrivateHistory();
	};
	
	// Handles Server Responses Accordingly
	onMessageReceived = (payload) => {
		var message_text = JSON.parse(payload.body);
		// This gets the Original Contents in the Map
		let temp = member_details.get(message_text.sender);
		
		if (message_text.type === "JOIN") {
			// Assign User to Online
			temp.status = "online";
			temp.date_time = message_text.date_time;
			
			this.setState({
				bellRing: true,
			});
		} else if (message_text.type === "LEAVE") {
			// Assign User to Offline
			temp.status = "offline";
			temp.date_time = message_text.date_time;
			
			this.setState({
				bellRing: true,
			});
		} else if (message_text.type === "TYPING") {
			// Assign User to Typing or Online depending on State
			if (message_text.content) temp.status = "typing...";
			if (message_text.content === "Stopped Typing") temp.status = "online";
			
		} else if (message_text.type === "CHAT") {
			temp.status = "online";
			// Decrypt
			messages.push({
				message: Encryption.decrypt_message(message_text.content),
				name: member_details.get(message_text.sender).name,
				sender: message_text.sender,
				date_time: message_text.date_time,
			});
			this.forceUpdate();
			if (message_text.sender === this.state.username) {
				this.scrollToBottom();
			}
			
		} else {
			// do nothing...
		}
		// Overwrite the Old Contents
		member_details.set(message_text.sender, temp);
		// Re-renders the Users List
		this.forceUpdate();
	};
	
	// Handles Server Responses Accordingly
	onChannelConnect = (payload) => {
		var message_text = JSON.parse(payload.body);
		// Checks if the Message was for this Org/Channel
		if(member_details.has(message_text.sender)){
			// This gets the Original Contents in the Map
			let temp = member_details.get(message_text.sender);
			
			if (message_text.type === "JOIN") {
				// Assign User to Online
				temp.status = "online";
				temp.date_time = message_text.date_time;
				
				this.setState({
					bellRing: true,
				});
			} else {
				if (message_text.type === "LEAVE") {
				// Assign User to Offline
				temp.status = "offline";
				temp.date_time = message_text.date_time;
				
				this.setState({
					bellRing: true,
				});
				} 
			}
			// Overwrite the Old Contents
			member_details.set(message_text.sender, temp);
			// Re-renders the Users List
			this.forceUpdate();
		}
	};
	
	onError = (error) => {
		this.setState({
		  error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
		})
	};
	
	fetchPrivateHistory = () => {
		stompClient.send("/app/fetch_private_history" + extension + "/" + this.state.username);
	};
	
	fetchPrivateMembers = () => {
		stompClient.send("/app/fetch_private_members" + extension + "/" + this.state.username);
	};
	
	scrollToBottom = () => {
		let chatDiv = document.getElementById("scrollable-chat");
		if (chatDiv) {
			chatDiv.scrollTop = chatDiv.scrollHeight;
			this.setState({bottom: false});
		}
	};
	
	handleSendMessage = () => {
        this.sendMessage('CHAT', this.state.message)
		this.setState({
			message: ''
		})
    };
	
	// This method handels all the "TYPING" actions
    handleTyping = (event) => {
		this.setState({
            message: event.target.value
        });

		// Check if the Value was Empty
		if(event.target.value === ""){
			// Set the is_typing boolean to false
			this.setState({
				isTyping: false
			})
			// Send a Message to the Server that User Stopped
			this.sendMessage("TYPING", "Stopped Typing");
		} else {
			// If the User was Not Typing, Set it to They Are
			if (this.state.isTyping === false){
				this.setState({
					isTyping: true
				})
				// Send the Message off and Save if not "Started Typing"
				this.sendMessage("TYPING", "Started Typing");
			}
		}
    };
	
	componentDidUpdate() {
		//let renderedMessages = document.getElementsByClassName("message").length;
		//console.log("Counter", counter, "Message Counter", messageCounter);
		if (counter === messageCounter && messageCounter > 0 && this.state.bottom) {
			this.scrollToBottom();
		}
	}
	componentWillUnmount() {
		window.location.reload(false);
	}
	componentDidMount() {
		this.myConnect();
		this.setState({
			currentTime: new Date().toLocaleString()
		})
		this.timerID = setInterval(
			() => this.state.bell_ring ? this.setState({
			bellRing: false
			}) : "",
			10000	
		);
	}
	
	mapMessages() {
		let retDiv;
		messageCounter = 0;
		retDiv = messages.map((old_msg) => {
			messageCounter++;
			return (
				<MessageComponent key={messageCounter} senderUsername={old_msg.sender} sender={member_details.get(old_msg.sender)} msg={old_msg}/>
			);
		});
		return retDiv;
	}
	
	render() {

        return (
			<div className="app-window chat-component">
				<Container fluid style={{height: "100%"}} className="pr-0">
					<Row className="title-header border-bottom">
					<h1>{this.state.receiver_name}</h1>
					</Row>
					<Row className="window-body">
						<Col xs={10} className="h-100 inline-block">
							<Container fluid style={{height: "90%"}}>
								<Container
									fluid
									className="h-100"
									id="scrollable-chat"
									style={{overflowY: "scroll"}}>
									{this.mapMessages()}
								</Container>
							</Container>
							<div className="d-flex flex-row justify-content-center">
								<input
									
									className="form-control rounded-left w-75"
									type="msg"
									id="msg"
									style={{borderRadius: "0px"}}
									placeholder="Enter Message"
									onChange={this.handleTyping}
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
						</Col>
					</Row>
				</Container>
			</div>
		);
	}
}

export default PrivateChatComponent;
