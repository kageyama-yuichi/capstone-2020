import React, {Component} from 'react'
import SockJS from 'sockjs-client'
import StompJS from 'stompjs'
import { API_URL } from '../../Constants'
import AuthenticationService from '../Authentication/AuthenticationService.js'
import  './PrivateChatComponent.css'

var stomp_client = null;

class PrivateChatComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			receiver: this.props.match.params.receiver,
			channel_connected: false,
			message: '',
			room_notification: [],
			messages: [],
			error: '',
			bottom: false,
			current_time: '',
			bell_ring: false,
			is_typing: false,
			loaded_history: false,
		};
	}
	
	// Function to Connect the User to the Server
	my_connect = () => {		
		console.log("System - Trying to Connect...");
		// Create the Socket
		const Stomp = require('stompjs')
		var SockJS = require('sockjs-client')
		var socket = new SockJS(API_URL+'/chat')
		stomp_client = Stomp.over(socket);
		console.log(stomp_client);
		// Connect the User
		stomp_client.connect({}, this.on_connected, this.on_error);		
	}
	
	// Subscribe the User to the Private Chat and Send the Server Notification of User
	on_connected = () => {
		console.log("System - Session is Connected.");
		this.setState({
		  channel_connected: true
		})
		
		stomp_client.subscribe('/queue/reply', this.on_message_received, {});
		// Just for Consistency
		if(this.state.username < this.state.receiver){ 
			// Subscribing to the a Private Chat
			stomp_client.subscribe('/user/reply/'+this.state.username+'/'+this.props.match.params.receiver, this.on_message_received, {});
			stomp_client.subscribe('/queue/'+this.state.username+'/'+this.props.match.params.receiver+'/reply', this.on_history_received, {});
		} else {
			// Subscribing to the a Private Chat
			stomp_client.subscribe('/user/reply/'+this.props.match.params.receiver+'/'+this.state.username, this.on_message_received, {});
			stomp_client.subscribe('/queue/'+this.props.match.params.receiver+'/'+this.state.username+'/reply', this.on_history_received, {});
		}
		this.fetch_private_history();
		
		// Registering user to server as a group chat user
		stomp_client.send("/app/existing_private_user", {}, JSON.stringify({ type: 'JOIN', sender: this.state.username }))
	}
	
	// Send Messages to the Server
	send_message = (type, value) => {
		var valid_message = true;
		if (stomp_client) {
			if(value === "")
				valid_message = false;
			else {
				var message = {
					sender: this.state.username,
					receiver: this.state.receiver,
					content: type === 'TYPING' ? value : value,
					type: type
				};
			}
			// Send Public Message
			if(valid_message){
				let url = "";
				// Just for Consistency
				if(this.state.username < this.state.receiver){ 
					url = "/app/send_private_message/"+this.state.username+"/"+this.state.receiver;
				} else {
					url = "/app/send_private_message/"+this.state.receiver+"/"+this.state.username;
				}
				stomp_client.send(url, {}, JSON.stringify(message));
			}
		}
	}

	// Handles Chat History
	on_history_received = (payload) => {
		var obj = JSON.parse(payload.body);
		if(!this.state.loaded_history){
			for(let i=0; i<obj.length; i++){
				this.state.messages.push({
					message: obj[i].content,
					sender: obj[i].sender,
					date_time: obj[i].date_time
				})
				this.setState({
					messages: this.state.messages,
					loaded_history: true
				})
			}
		}
		
		
	}
	
	// Handles Server Responses Accordingly
	on_message_received = (payload) => {
		console.log(payload);
		var message_text = JSON.parse(payload.body);
		var user_exists = false;
		if (message_text.type === 'JOIN') {
			// Checks if the Users already Exists
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender) {
					notification.status = "online";
					notification.date_time = message_text.date_time;
					user_exists = true;
				}
			})
			// If the User wasn't in Cache
			if(!user_exists){
				this.state.room_notification.push({ 'sender': message_text.sender, 'status': 'online', 'date_time': message_text.date_time })
			}
			this.setState({
				room_notification: this.state.room_notification.sort(this.sort_by_online_names),
				bell_ring: true
			})
		}
		else if (message_text.type === 'LEAVE') {
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender) {
					notification.status = "offline";
					notification.date_time = message_text.date_time;
				}
			})
			this.setState({
				room_notification: this.state.room_notification.sort(this.sort_by_online_names),
				bell_ring: true
			})
		}
		else if (message_text.type === 'TYPING') {
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender) {
					if (message_text.content)
						notification.status = "typing...";
					if (message_text.content === "Stopped Typing")
						notification.status = "online";
				}
			})
			this.setState({
				room_notification: this.state.room_notification
			})
		}
		else if (message_text.type === 'CHAT') {
			console.log("System - Chat Message Received");
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender) {
					notification.status = "online";
				}
			})
			// Decrypt
			this.state.messages.push({
				message: message_text.content,
				sender: message_text.sender,
				date_time: message_text.date_time
			})
			this.setState({
				messages: this.state.messages,
			})
		}
		else {
		// do nothing...
		}
	}
	
	on_error = (error) => {
		this.setState({
		  error: 'Could not connect you to the Chat Room Server. Please refresh this page and try again!'
		})
	}
	
	fetch_private_history = () => {
		console.log("System - Retrieving Old Messages");
		let url = "";
		// Just for Consistency
		if(this.state.username < this.state.receiver){ 
			url = "/app/fetch_private_history/"+this.state.username+"/"+this.state.receiver;
		} else {
			url = "/app/fetch_private_history/"+this.state.receiver+"/"+this.state.username;
		}
		stomp_client.send(url);
	}
	
	scroll_to_bottom = () => {
		var object = this.refs.messageBox;
		if (object)
			object.scrollTop = object.scrollHeight;
	}
	
	handle_send_message = () => {
        this.send_message('CHAT', this.state.message)
		this.setState({
			message: ''
		})
    }
	
	// This method handels all the "TYPING" actions
    handle_typing = (event) => {
		this.setState({
            message: event.target.value
        });

		// Check if the Value was Empty
		if(event.target.value === ""){
			// Set the is_typing boolean to false
			this.setState({
				is_typing: false
			})
			// Send a Message to the Server that User Stopped
			this.send_message("TYPING", "Stopped Typing");
		} else {
			// If the User was Not Typing, Set it to They Are
			if (this.state.is_typing === false){
				this.setState({
					is_typing: true
				})
				// Send the Message off and Save if not "Started Typing"
				this.send_message("TYPING", "Started Typing");
			}
		}
    };
	
	componentDidUpdate() {
		if (this.state.error) {
			throw new Error('Unable to connect to chat room server.');
		}
		else {
			this.scroll_to_bottom();
		}
	}

	componentDidMount() {
		this.my_connect();
		this.setState({
			current_time: new Date().toLocaleString()
		})
		this.timerID = setInterval(
			() => this.state.bell_ring ? this.setState({
			bell_ring: false
			}) : "",
			10000	
		);
	}
	
	render() {
		console.log("System - Rendering Page...");
		console.log("System - Connection Status: "+this.state.channel_connected);

        return (
			<div className="app-window chat-component">
				<h1 className="room-name">L8Z Chat Room</h1>
				<div className="chat-room-container">
					<div className="messages-container">
						<div className="message-list">
							{
								this.state.messages.map((msg, i) => (
								<div key={i} className="message">
									<div className="message-details">
										<div className="message-sender">
											{msg.sender}
										</div>
										
										{/* <div className="message-date">
											July 3rd 2020 at 12:30am
										</div> */}
									</div>
									
									<div className="message-body">
										{msg.message}
									</div>
								</div>
							))
							}
						</div>
						<div className="message-input-container">
							<input
								className="message-input"
								type="msg"
								id="msg"
								placeholder="Enter Message"
								onChange={this.handle_typing}
								value={this.state.message}
								onKeyPress={event => {
									if (event.key === "Enter") {
										this.handle_send_message();
									}
								}}
							/>
							<input
								className="message-button"
								type="button"
								value="SEND"
								onClick={this.handle_send_message}
							/>
						</div>

						{this.scroll_to_bottom()}
					</div>
				</div>
			</div>
		);
	}
}

export default PrivateChatComponent;
