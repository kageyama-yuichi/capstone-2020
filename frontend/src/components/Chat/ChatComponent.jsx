import React, {Component} from 'react'
import SockJS from 'sockjs-client'
import StompJS from 'stompjs'
import { API_URL } from '../../Constants'
import  './ChatComponent.css'

var stomp_client = null;
var orgs_id = null;
var channel_title = null;
var instance_title = null;
var extension = null;

class ChatComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: '',
			channel_connected: false,
			message: '',
			room_notification: [],
			broadcast_message: [],
			old_messages: [],
			error: '',
			bottom: false,
			current_time: '',
			open_notifications: false,
			bell_ring: false,
			is_typing: false,
			loaded_history: false,
		};
	}
	
	// Function to Connect the User to the Server
	my_connect = (new_username) => {
		console.log(this.props.match.params);
		orgs_id = "/"+this.props.match.params.orgs_id;
		channel_title = "/"+this.props.match.params.channel_title;
		instance_title = "/"+this.props.match.params.instance_title;
		extension = orgs_id+channel_title+instance_title;
		
		console.log(orgs_id);
		console.log(channel_title);
		console.log(instance_title);
		console.log(extension);
		
		console.log("System - Trying to Connect...");
		if (new_username) {
			// Create the Socket
			const Stomp = require('stompjs')
			var SockJS = require('sockjs-client')
			var socket = new SockJS(API_URL+'/chat')
			stomp_client = Stomp.over(socket);
			console.log(stomp_client);
			// Connect the User
			stomp_client.connect({}, this.on_connected, this.on_error);
			this.setState({
				username: new_username,
			})
		}
	}
	
	// Subscribe the User to the Groups and Send the Server Notification of User
	on_connected = () => {
		console.log("System - Session is Connected.");
		this.setState({
		  channel_connected: true
		})
		// Subscribing to the public Group
		stomp_client.subscribe('/group/members'+extension, this.on_members_received, {});
		stomp_client.subscribe('/group/history'+extension, this.on_history_received, {});
		stomp_client.subscribe('/group'+extension, this.on_message_received, {});
		this.fetch_members();
		this.fetch_history();
		
		// Registering user to server as a group chat user
		stomp_client.send("/app/existing_user"+extension, {}, JSON.stringify({ type: 'JOIN', sender: this.state.username }))
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
					content: type === 'TYPING' ? value : value,
					type: type
				};
			}
			// Send Public Message
			if(valid_message)
				stomp_client.send("/app/send_message"+extension, {}, JSON.stringify(message));
		}
	}

	// Handles Chat History
	on_history_received = (payload) => {
		var obj = JSON.parse(payload.body);
		if(!this.state.loaded_history){
			for(let i=0; i<obj.length; i++){
				this.state.old_messages.push({
					message: obj[i].content,
					sender: obj[i].sender,
					date_time: obj[i].date_time
				})
				this.setState({
					old_messages: this.state.old_messages,
					loaded_history: true
				})
			}
		}
		
		
	}
	
	// Handles Member Loading
	on_members_received = (payload) => {
		var obj = JSON.parse(payload.body);
		var does_exist = false;
		
		for(let i=0; i<obj.length; i++){
			this.state.room_notification.map((notification, counter) => {
				if (notification.sender === obj[i].username) {
					does_exist = true;
				}
			})
			if(!does_exist){
				this.state.room_notification.push({
					'sender': obj[i].username,
					'status': 'offline',
					'date_time': ''
				})
			} else {
				// Reset variable
				does_exist = false;
			}
			this.setState({
				room_notification: this.state.room_notification.sort(this.sort_by_online_names)
			})
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
			this.state.broadcast_message.push({
				message: message_text.content,
				sender: message_text.sender,
				date_time: message_text.date_time
			})
			this.setState({
				broadcast_message: this.state.broadcast_message,
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
	
	fetch_history = () => {
		console.log("System - Retrieving Old Messages");
		stomp_client.send("/app/fetch_history"+extension);
	}
	
	fetch_members = () => {
		console.log("System - Retrieving Members");
		stomp_client.send("/app/fetch_members"+extension);
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
	
	// This function is a complementary function to .sort() where it 
	// helps Sort by Status (Online on Top) and then Name
	sort_by_online_names = (a, b) => {
		const user_a_name = a.sender.toUpperCase();
		const user_a_status = a.status;
		const user_b_name = b.sender.toUpperCase();
		const user_b_status = b.status;
		
		let comparison = 0;
		if(user_a_status < user_b_status){
			comparison = 1;
		} else if (user_a_status > user_b_status) {
			comparison = -1;
		} else {
			if (user_a_name > user_b_name) {
				comparison = 1;
			} else if (user_a_name < user_b_name) {
				comparison = -1;
			}
		}
		return comparison;
	}
	
	componentDidUpdate() {
		if (this.state.error) {
			throw new Error('Unable to connect to chat room server.');
		}
		else {
			this.scroll_to_bottom();
		}
	}

	componentDidMount() {
		this.username = 'Michael';
		this.my_connect(this.username);
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
								this.state.old_messages.map((old_msg, i) => (
								<div key={i} className="message">
									<div className="message-details">
										<div className="message-sender">
											{old_msg.sender}
										</div>
										
										{/* <div className="message-date">
											July 3rd 2020 at 12:30am
										</div> */}
									</div>
									
									<div className="message-body">
										{old_msg.message}
									</div>
								</div>
							))
							}
							{this.state.broadcast_message.map((bc_msg, i) => (
								<div key={i} className="message">
									<div className="message-details">
										<div className="message-sender">
											{bc_msg.sender}
										</div>
										
										{/* <div className="message-date">
											July 3rd 2020 at 12:30am
										</div> */}
									</div>
									
									<div className="message-body">
										{bc_msg.message}
									</div>
								</div>
							))}
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
					<div className="user-container">
						<h1 className="user-title">Users</h1>
						<div className="user-list">
							{this.state.room_notification.map((rm_not, j) => (
								<p key={j}>
									- {rm_not.sender} ({rm_not.status})
								</p>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ChatComponent;
