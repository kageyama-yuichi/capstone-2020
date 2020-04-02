import React, {Component} from 'react'
import SockJS from 'sockjs-client'
import StompJS from 'stompjs'
import { API_URL } from '../../Constants'

var stomp_client = null;

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
			bell_ring: false
		};
	}
	
	// Function to Connect the User to the Server
	my_connect = (new_username) => {
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
		stomp_client.subscribe('/group/public', this.on_message_received, {});
		stomp_client.subscribe('/group/public/history', this.on_history_received, {});
		this.fetch_history();
		// Registering user to server as a public chat user
		stomp_client.send("/app/existing_user", {}, JSON.stringify({ type: 'JOIN', sender: this.state.username }))
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
				stomp_client.send("/app/send_message", {}, JSON.stringify(message));
		}
	}

	// Handles Chat History
	on_history_received = (payload) => {
		console.log(payload);
		var obj = JSON.parse(payload.body);
		console.log(obj);
		console.log(obj.length);
	
		for(let i=0; i<obj.length; i++){
			this.state.old_messages.push({
				message: obj[i].content,
				sender: obj[i].sender,
				date_time: obj[i].date_time
			})
			this.setState({
				old_messages: this.state.old_messages,
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
				room_notification: this.state.room_notification,
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
				room_notification: this.state.room_notification,
				bell_ring: true
			})
		}
		else if (message_text.type === 'TYPING') {
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender) {
					if (message_text.content)
						notification.status = "typing...";
					else
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
		stomp_client.send("/app/fetch_history");
		//alert('History Not Available!\nIt is Not Yet Implemented!');
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
	
    handle_typing = (event) => {
		this.setState({
            message: event.target.value,
        });
        this.send_message('TYPING', event.target.value);
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
		this.username = 'Michael';
		this.state.room_notification.map((notification, i) => {
				console.log("HERE");
				if (notification.sender === this.username) {
					this.username = 'Shaahin';
				}
			})
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
            <div className="ChatComponent">
				<h1>L8Z Chat Room</h1>
				<h1>Users</h1>
				{
					this.state.room_notification.map((rm_not, i) => (
					<p key={i}>{rm_not.sender} ({rm_not.status})</p>
					))
				}
				<h1>Messages</h1>
				{
					this.state.old_messages.map((old_msg, i) => (
						<p key={i}>{old_msg.sender}: {old_msg.message}</p>
					))
				}
				{
					this.state.broadcast_message.map((bc_msg, i) => (
						<p key={i}>{bc_msg.sender}: {bc_msg.message}</p>
					))
				}
				<input 
					type="msg"
					id="msg"
					placeholder="Enter Message"
					onChange={this.handle_typing}
					value={this.state.message}
					onKeyPress={event => {
                        if (event.key === 'Enter') {
                            this.handle_send_message();
                        }
                    }}
					/>
					{
						this.scroll_to_bottom()
					}
			</div>
        )
    }
}

export default ChatComponent
