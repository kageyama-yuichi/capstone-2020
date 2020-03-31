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
			messages: [],
			room_notification: [],
			broadcast_message: [],
			error: '',
			bottom: false,
			curTime: '',
			openNotifications: false,
			bellRing: false
		};
		var id_counter = 0;
	}
	
	my_connect = (new_username) => {
		console.log("System - Trying to Connect...");
		if (new_username) {
			const Stomp = require('stompjs')
			var SockJS = require('sockjs-client')
			var socket = new SockJS(API_URL+'/chat')
			stomp_client = Stomp.over(socket);
			console.log(stomp_client);
			stomp_client.connect({}, this.on_connected, this.on_error);
			this.setState({
				username: new_username,
			})
		}
	}
	
	on_connected = () => {
		console.log("System - Session is Connected.");
		this.setState({
		  channel_connected: true
		})
		// Subscribing to the public Group
		stomp_client.subscribe('/group/public', this.on_message_received, {});
		// Registering user to server as a public chat user
		stomp_client.send("/app/existing_user", {}, JSON.stringify({ type: 'JOIN', sender: this.state.username }))
	}
	
	send_message = (type, value) => {
		if (stomp_client) {
			var message = {
				sender: this.state.username,
				content: type === 'TYPING' ? value : value,
				type: type
			};
		  // send public message
		  stomp_client.send("/app/send_message", {}, JSON.stringify(message));
		}
	}

	on_message_received = (payload) => {
		var message_text = JSON.parse(payload.body);
		if (message_text.type === 'JOIN') {
			this.state.room_notification.push({ 'sender': message_text.sender + " ~ joined", 'status': 'online', 'dateTime': message_text.dateTime })
			this.setState({
				room_notification: this.state.room_notification,
				bell_ring: true
			})
		}
		else if (message_text.type === 'LEAVE') {
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender + " ~ joined") {
					notification.status = "offline";
					notification.sender = message_text.sender + " ~ left";
					notification.dateTime = message_text.dateTime;
				}
			})
			this.setState({
				room_notification: this.state.room_notification,
				bell_ring: true
			})
		}
		else if (message_text.type === 'TYPING') {
			this.state.room_notification.map((notification, i) => {
				if (notification.sender === message_text.sender + " ~ joined") {
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
				if (notification.sender === message_text.sender + " ~ joined") {
				notification.status = "online";
				}
			})
			this.state.broadcast_message.push({
				message: message_text.content,
				sender: message_text.sender,
				dateTime: message_text.dateTime
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
		alert('History Not Available!\nIt is Not Yet Implemented!');
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
		this.my_connect(this.username);
		this.setState({
			curTime: new Date().toLocaleString()
		})
		this.timerID = setInterval(
			() => this.state.bellRing ? this.setState({
			bellRing: false
			}) : "",
			10000	
		);
	}
	
	render() {
		console.log("System - Rendering Page...");
		console.log("System - Connection Status: "+this.state.channel_connected);
        return (
            <div className="ChatComponent">
				<h1>L8Z Chatting</h1>
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
			</div>
        )
    }
}

export default ChatComponent
