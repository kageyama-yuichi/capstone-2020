import React, {Component} from "react";
import {API_URL} from "../../Constants";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./ChatComponent.css";
import Encryption from "./Encryption.js";
import {Container, Row, Col, Button} from "react-bootstrap";
import MessageComponent from "./Message/MessageComponent.jsx";

var stomp_client = null;
var orgs_id = null;
var channel_title = null;
var instance_title = null;
var extension = null;
var counter = 0;
var messageCounter = 0;
var messages = [];
const instance_member_details = new Map();
// Sender in All Instances are the Usernames of the User

/* Things Left to Do:
	- Bubbles for Users (Pull Users infromation from instance_member_details
*/

class ChatComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			channel_connected: false,
			message: "",
			error: "",
			member_list: [],

			joined: false,
			current_time: "",
			open_members: false,
			bell_ring: false,
			is_typing: false,
			bottom: true,
			org_id: props.org_id,
			channel_title: props.channel_title,
			instance_title: props.instance_title,
		};
	}
	// Function to Connect the User to the Server
	my_connect = () => {
		console.log("myconnect called");
		orgs_id = "/" + this.props.org_id;
		channel_title = "/" + this.props.channel_title;
		instance_title = "/" + this.props.instance_title;
		extension = orgs_id + channel_title + instance_title;

		console.log("System - Trying to Connect...");

		// Create the Socket
		const Stomp = require("stompjs");
		var SockJS = require("sockjs-client");
		var socket = new SockJS(API_URL + "/chat");
		stomp_client = Stomp.over(socket);
		//console.log(stomp_client);
		// Disables Console Messages
		stomp_client.debug = null;
		// Connect the User
		stomp_client.connect({}, this.on_connected, this.on_error);
	};

	// Subscribe the User to the Groups and Send the Server member of User
	on_connected = () => {
		console.log("System - Session is Connected.");
		this.setState({
			channel_connected: true,
		});
		// Subscribe to Fetching History and Members
		// This has changed to Subscribe based on your Username so that when others join
		// messages are not given to you. This will also allow for later chat loads
		// e.g., load 20 per page and then using javascript .unshift() push the new chat
		stomp_client.subscribe(
			"/group/members" + extension + "/" + this.state.username,
			this.on_members_received,
			{}
		);
		stomp_client.subscribe(
			"/group/history" + extension + "/" + this.state.username,
			this.on_history_received,
			{}
		);
		// Subscribing to the public Group
		stomp_client.subscribe("/group" + extension, this.on_message_received, {});
		// Subscribe to the Join and Leave for Live Feedback
		stomp_client.subscribe("/online", this.on_channel_connect, {});
		this.fetch_members();
	};

	// Send Messages to the Server
	send_message = (type, value) => {
		var valid_message = true;
		if (stomp_client) {
			if (value === "") valid_message = false;
			else {
				var message = {
					sender: this.state.username,
					content: type === "TYPING" ? value : Encryption.encrpyt_message(value),
					type: type,
				};
			}
			// Send Public Message
			if (valid_message)
				stomp_client.send("/app/send_message" + extension, {}, JSON.stringify(message));
		}
	};

	// Handles Chat History
	on_history_received = (payload) => {
		
		var obj = JSON.parse(payload.body);
		// Iterate over
		for (let i = obj.length - 1; i >= 0; i--) {
			// Use Unshift to Push objects from back to front
			messages.unshift({
				message: Encryption.decrypt_message(obj[i].content),
				sender: obj[i].sender,
				name: instance_member_details.get(obj[i].sender).name,
				date_time: obj[i].date_time,
			});
			counter++;
		}

		// Might need to Change this so that we can load e.g., 20 Messages per Request
		stomp_client.unsubscribe("/group/history" + extension + "/" + this.state.username, {});
		if (!this.state.joined) {
			// Registering user to server as a Organisation User
			stomp_client.send(
				"/app/existing_user",
				{},
				JSON.stringify({type: "JOIN", sender: this.state.username})
			);
			this.setState({
				joined: true,
			});
		}
		console.log("got messages");
	};

	// Handles Member Loading
	on_members_received = (payload) => {
		var obj = JSON.parse(payload.body);
		var does_exist = false;

		// Go through Server Message and Extract Users
		for (let i = 0; i < obj.length; i++) {
			// Checks if the User Exists
			does_exist = instance_member_details.has(obj[i].username);

			if (!does_exist) {
				// Used for Storing in the Map
				let user_details = {
					status: obj[i].status,
					role: obj[i].role,
					fname: obj[i].fname,
					lname: obj[i].lname,
					name: obj[i].fname + " " + obj[i].lname,
					bio: obj[i].bio,
					image_path: obj[i].image_path,
					date_time: "",
				};
				// Add them to the Members
				instance_member_details.set(obj[i].username, user_details);
			}
		}
		// Sort the Members Map
		this.sort_instance_member_details_map();

		// Unsubscribe from Retrieving Members for Server Stability
		stomp_client.unsubscribe("/group/members" + extension + "/" + this.state.username, {});
		// Now Fetch the History
		return this.fetch_history();
	};

	// Handles Server Responses Accordingly
	on_message_received = (payload) => {
		var message_text = JSON.parse(payload.body);
		var does_require_sorting = false;
		// This gets the Original Contents in the Map
		let temp = instance_member_details.get(message_text.sender);

		if (message_text.type === "JOIN") {
			// Assign User to Online
			temp.status = "online";
			temp.date_time = message_text.date_time;
			does_require_sorting = true;

			this.setState({
				bell_ring: true,
			});
		} else if (message_text.type === "LEAVE") {
			// Assign User to Offline
			temp.status = "offline";
			temp.date_time = message_text.date_time;
			does_require_sorting = true;

			this.setState({
				bell_ring: true,
			});
		} else if (message_text.type === "TYPING") {
			// Assign User to Typing or Online depending on State
			if (message_text.content) temp.status = "typing...";
			if (message_text.content === "Stopped Typing") temp.status = "online";
		} else if (message_text.type === "CHAT") {
			console.log("System - Chat Message Received");
			temp.status = "online";
			// Decrypt
			messages.push({
				message: Encryption.decrypt_message(message_text.content),
				name: instance_member_details.get(message_text.sender).name,
				sender: message_text.sender,
				date_time: message_text.date_time,
			});
			this.forceUpdate();
			if (message_text.sender === this.state.username) {
				this.scroll_to_bottom();
			}
		} else {
			// do nothing...
		}
		// Overwrite the Old Contents
		instance_member_details.set(message_text.sender, temp);

		if (does_require_sorting) {
			// Sort the Members Map
			this.sort_instance_member_details_map();
		}
		// Re-renders the Users List
		this.forceUpdate();
	};

	// Handles Server Responses Accordingly
	on_channel_connect = (payload) => {
		var message_text = JSON.parse(payload.body);
		// Checks if the Message was for this Org/Channel
		if (instance_member_details.has(message_text.sender)) {
			// This gets the Original Contents in the Map
			let temp = instance_member_details.get(message_text.sender);

			if (message_text.type === "JOIN") {
				// Assign User to Online
				temp.status = "online";
				temp.date_time = message_text.date_time;

				this.setState({
					bell_ring: true,
				});
			} else {
				if (message_text.type === "LEAVE") {
					// Assign User to Offline
					temp.status = "offline";
					temp.date_time = message_text.date_time;

					this.setState({
						bell_ring: true,
					});
				}
			}
			// Overwrite the Old Contents
			instance_member_details.set(message_text.sender, temp);
			// Sort the Members Map
			this.sort_instance_member_details_map();
			// Re-renders the Users List
			this.forceUpdate();
		}
	};

	on_error = (error) => {
		this.setState({
			error:
				"Could not connect you to the Chat Room Server. Please refresh this page and try again!",
		});
	};

	fetch_history = () => {
		console.log("System - Retrieving Old Messages");
		stomp_client.send("/app/fetch_history" + extension + "/" + this.state.username);
	};

	fetch_members = () => {
		console.log("System - Retrieving Members");
		stomp_client.send("/app/fetch_members" + extension + "/" + this.state.username);
	};

	scroll_to_bottom = () => {
		let chatDiv = document.getElementById("scrollable-chat");
		if (chatDiv) {
			//console.log("Chat div ", chatDiv);
			chatDiv.scrollTop = chatDiv.scrollHeight;
			this.setState({bottom: false});
		}
	};

	handle_send_message = () => {
		this.send_message("CHAT", this.state.message);
		this.setState({
			message: "",
		});
	};

	// This method handels all the "TYPING" actions
	handle_typing = (event) => {
		this.setState({
			message: event.target.value,
		});

		// Check if the Value was Empty
		if (event.target.value === "") {
			// Set the is_typing boolean to false
			this.setState({
				is_typing: false,
			});
			// Send a Message to the Server that User Stopped
			this.send_message("TYPING", "Stopped Typing");
		} else {
			// If the User was Not Typing, Set it to They Are
			if (this.state.is_typing === false) {
				this.setState({
					is_typing: true,
				});
				// Send the Message off and Save if not "Started Typing"
				this.send_message("TYPING", "Started Typing");
			}
		}
	};

	// This function is a complementary function to .sort() where it
	// helps Sort by Status (Online on Top) and then Name
	sort_by_online_names = (a, b) => {
		const user_a_name = a[1].name.toUpperCase();
		const user_a_status = a[1].status;
		const user_b_name = b[1].name.toUpperCase();
		const user_b_status = b[1].status;

		let comparison = 0;
		if (user_a_status < user_b_status) {
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
	};

	// Function to Keep the Members Map Sorted
	sort_instance_member_details_map = () => {
		// Create the Temporary Sorted Map
		const map_sorted_temp = new Map(
			[...instance_member_details.entries()].sort(this.sort_by_online_names)
		);
		// Clear the Old Map
		instance_member_details.clear();
		// Assign the Temporary Sorted Map to the Members Map
		for (let [key, value] of map_sorted_temp) {
			instance_member_details.set(key, value);
		}
	};

	resetLocalVariables() {
		stomp_client.disconnect();
		stomp_client = null;
		orgs_id = null;
		channel_title = null;
		instance_title = null;
		extension = null;
		counter = 0;
		messageCounter = 0;
		messages = [];
		instance_member_details.clear();
	}

	componentDidUpdate(prevProps) {
		//let renderedMessages = document.getElementsByClassName("message").length;
		console.log("Counter", counter, "Message Counter", messageCounter);
		if (
			prevProps.channel_title !== this.props.channel_title ||
			prevProps.instance_title !== this.props.instance_title
		) {
			this.resetLocalVariables();
			this.setState(
				{
					channel_title: this.props.channel_title,
					instance_title: this.props.instance_title,
					joined: false,
					bottom: true,
				},
				this.my_connect()
			);
		} else {
			if (counter === messageCounter && messageCounter > 0 && this.state.bottom) {
				console.log("How many rendered", messageCounter, messages.length);
				this.scroll_to_bottom();
				console.log("Called scroll");
			}
		}
	}

	componentWillUnmount() {
		window.location.reload(false);
	}

	componentDidMount() {
		this.my_connect();
		this.setState({
			current_time: new Date().toLocaleString(),
		});
		this.timerID = setInterval(
			() =>
				this.state.bell_ring
					? this.setState({
							bell_ring: false,
					  })
					: "",
			10000
		);
	}

	mapMessages() {
		let retDiv;
		messageCounter = 0;
		console.log("messages", messages);

		retDiv = messages.map((old_msg) => {
			messageCounter++;
			return (
				<MessageComponent
					key={messageCounter}
					sender={instance_member_details.get(old_msg.sender)}
					msg={old_msg}
				/>
			);
		});
		return retDiv;
	}

	mapUsers() {
		let retDiv;
		retDiv = [...instance_member_details.keys()].map((key) => {
			return (
				<p key={key}>
					{instance_member_details.get(key).name} (
					{instance_member_details.get(key).status}) @{key}
				</p>
			);
		});
		return retDiv;
	}

	render() {
		console.log(
			"System - Rendering Page... Connection Status to Server: " +
				this.state.channel_connected
		);

		return (
			<div className="chat-component">
				{this.state.instance_title ? (
					<Container fluid style={{height: "100%"}} className="pr-0">
						<h1 className="title-header border-bottom">
							{this.state.instance_title} - Chat Room
						</h1>

						<div className="d-flex window-body w-100">
							<Container className="ml-0 mr-0 pl-0 flex-fill pr-0">
								<Container fluid className="pr-0" style={{height: "90%"}}>
									<Container
										fluid
										className="h-100 w-100 pr-0"
										id="scrollable-chat"
										style={{overflowY: "auto"}}>
										{this.mapMessages()}

										{/* <div className="message-date">
											July 3rd 2020 at 12:30am
										</div> */}
									</Container>
								</Container>
								<div className="d-flex flex-row justify-content-center">
									<input
										className="form-control rounded-left w-75"
										type="msg"
										id="msg"
										style={{borderRadius: "0px"}}
										placeholder="Enter Message"
										onChange={this.handle_typing}
										value={this.state.message}
										onKeyPress={(event) => {
											if (event.key === "Enter") {
												this.handle_send_message();
											}
										}}
									/>
									<Button
										type="button"
										variant="secondary"
										style={{borderRadius: "0px"}}
										className="rounded-right"
										onClick={this.handle_send_message}>
										SEND
									</Button>
								</div>
							</Container>
							<Container
								fluid
								className="pl-0 pr-0 ml-0 mr-0 h-100 flex-fill"
								style={{minWidth: "150px", maxWidth: "300px"}}>
								<div className="user-container h-100">
									<h1 className="user-title">Users</h1>
									<div className="user-list">{this.mapUsers()}</div>
								</div>
							</Container>
						</div>
					</Container>
				) : (
					<h1>A welcome page here would be pretty cool</h1>
				)}
			</div>
		);
	}
}

export default ChatComponent;
