import React, {Component} from "react";
import {API_URL} from "../../Constants";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import "./ChatComponent.css";
import Encryption from "./Encryption.js";
import {Container} from "react-bootstrap";
import OrgResources from "../Orgs/OrgsResources.js";
import MessageInputComponent from "./MessageInputComponent.jsx";
import ChatTabbedSidebarComponent from "./ChatTabbedSidebarComponent.jsx";
import MessagesListComponent from "./MessagesListComponent";

var stomp_client = null;
var orgsId = null;
var channelTitle = null;
var instanceTitle = null;
var extension = null;
var counter = 0;
var messageCounter = 0;
var messages = [];
var visible = 0;
var oldMessageLength = 0;
var shouldScrollToBottom = true;
const instance_member_details = new Map();


class ChatComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			memberList: [],
			readLast: "",
			joined: false,
			orgId: props.org_id,
			channelTitle: props.channel_title,
			instanceTitle: props.instance_title,
		};
		this.handleScrollToBottom = this.handleScrollToBottom.bind(this);
	}
	// Function to Connect the User to the Server
	myConnect = () => {
		orgsId = "/" + this.props.org_id;
		channelTitle = "/" + this.props.channel_title;
		instanceTitle = "/" + this.props.instance_title;
		extension = orgsId + channelTitle + instanceTitle;

		// Create the Socket
		const Stomp = require("stompjs");
		var SockJS = require("sockjs-client");
		var socket = new SockJS(API_URL + "/chat");
		stomp_client = Stomp.over(socket);
		// Disables Console Messages
		stomp_client.debug = null;
		// Connect the User
		stomp_client.connect({}, this.onConnected, this.onError);
	};

	// Subscribe the User to the Groups and Send the Server member of User
	onConnected = () => {
		this.setState({
			channelConnected: true,
		});
		// Subscribe to Fetching History and Members
		// This has changed to Subscribe based on your Username so that when others join
		// messages are not given to you. This will also allow for later chat loads
		// e.g., load 20 per page and then using javascript .unshift() push the new chat
		stomp_client.subscribe(
			"/group/members" + extension + "/" + this.state.username,
			this.onMembersReceived,
			{}
		);
		stomp_client.subscribe(
			"/group/history" + extension + "/" + this.state.username,
			this.onHistoryReceived,
			{}
		);
		// Subscribing to the public Group
		stomp_client.subscribe("/group" + extension, this.onMessageReceived, {});
		// Subscribe to the Join and Leave for Live Feedback
		stomp_client.subscribe("/online", this.onChannelConnect, {});
		this.fetchMembers();
	};

	// Send Messages to the Server
	sendMessage = (type, value) => {
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
	onHistoryReceived = (payload) => {
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
		oldMessageLength = messages.length - 1;
	};

	// Handles Member Loading
	onMembersReceived = (payload) => {
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
		this.sortInstanceMemberDetailsMap();

		// Unsubscribe from Retrieving Members for Server Stability
		stomp_client.unsubscribe("/group/members" + extension + "/" + this.state.username, {});
		// Now Fetch the History
		return this.fetchHistory();
	};

	// Handles Server Responses Accordingly
	onMessageReceived = (payload) => {
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
				bellRing: true,
			});
		} else if (message_text.type === "LEAVE") {
			// Assign User to Offline
			temp.status = "offline";
			temp.date_time = message_text.date_time;
			does_require_sorting = true;

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
				name: instance_member_details.get(message_text.sender).name,
				sender: message_text.sender,
				date_time: message_text.date_time,
			});
			if (message_text.sender === this.state.username) {
				shouldScrollToBottom = true;
			}
		} else {
			// do nothing...
		}
		// Overwrite the Old Contents
		instance_member_details.set(message_text.sender, temp);

		if (does_require_sorting) {
			// Sort the Members Map
			this.sortInstanceMemberDetailsMap();
		}
		// Re-renders the Users List
		this.forceUpdate();
	};

	// Handles Server Responses Accordingly
	onChannelConnect = (payload) => {
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
			instance_member_details.set(message_text.sender, temp);
			// Sort the Members Map
			this.sortInstanceMemberDetailsMap();
			// Re-renders the Users List
			this.forceUpdate();
		}
	};

	onError = (error) => {
		this.setState({
			error:
				"Could not connect you to the Chat Room Server. Please refresh this page and try again!",
		});
	};

	fetchHistory = () => {
		stomp_client.send("/app/fetch_history" + extension + "/" + this.state.username);
	};

	fetchMembers = () => {
		stomp_client.send("/app/fetch_members" + extension + "/" + this.state.username);
	};

	scroll_to_bottom = () => {
		let chatDiv = document.getElementById("scrollable-chat");
		if (chatDiv) {
			chatDiv.scrollTop = chatDiv.scrollHeight;
			//Set the visible to last message
			if (messages.length > 0) {
				visible = messages.length - 1;
			}
			
		}
	};

	handleSendMessage = (message) => {
		this.sendMessage("CHAT", message);
	};

	// This function is a complementary function to .sort() where it
	// helps Sort by Status (Online on Top) and then Name
	sortByOnlineNames = (a, b) => {
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
	sortInstanceMemberDetailsMap = () => {
		// Create the Temporary Sorted Map
		const map_sorted_temp = new Map(
			[...instance_member_details.entries()].sort(this.sortByOnlineNames)
		);
		// Clear the Old Map
		instance_member_details.clear();
		// Assign the Temporary Sorted Map to the Members Map
		for (let [key, value] of map_sorted_temp) {
			instance_member_details.set(key, value);
		}
	};

	resetLocalVariables() {
		if (stomp_client) {
			stomp_client.disconnect();
		}
		stomp_client = null;
		orgsId = null;
		channelTitle = null;
		instanceTitle = null;
		extension = null;
		counter = 0;
		messageCounter = 0;
		messages = [];
		visible = 0;
		oldMessageLength = 0;
		shouldScrollToBottom = true;
		instance_member_details.clear();
	}

	componentDidUpdate(prevProps) {
		//let renderedMessages = document.getElementsByClassName("message").length;
		if (
			prevProps.channel_title !== this.props.channel_title ||
			prevProps.instance_title !== this.props.instance_title
		) {
			this.resetLocalVariables();
			this.setState(
				{
					channelTitle: this.props.channel_title,
					instanceTitle: this.props.instance_title,
					joined: false,
					bottom: true,
				},
				() => {
					this.getReadLast();
					this.myConnect();
				}
			);
		} else {
			if (counter === messageCounter && messageCounter > 0) {
				shouldScrollToBottom = true;
			}
		}
	}

	setMessageCounter(counter) {
		messageCounter = counter;
	}

	componentWillUnmount() {
		if (messages.length > 0) {
			console.log(visible, messages)
			OrgResources.setChannelInstanceChatTime(
				this.state.username,
				this.state.orgId,
				this.state.channelTitle,
				this.state.instanceTitle,
				messages[visible].date_time
			);
		}

		this.resetLocalVariables();
	}

	//Called when message list div is scrolled to update the viewed last of the user
	handleScroll(event) {
		var messageContainerHeight = 863;
		var chatDiv = document.getElementById("scrollable-chat");
		if (chatDiv) {
			messageContainerHeight = chatDiv.getBoundingClientRect().height;
		}

		if (chatDiv) {
			//console.log("Chat div ", chatDiv);

			let displayedMessages = document.getElementsByClassName("displayed-message");
			if (displayedMessages) {
				for (var i = 0; i < displayedMessages.length; i++) {
					if (i > visible) {
						if (
							Math.round(
								messageContainerHeight +
									chatDiv.scrollTop -
									displayedMessages[i].offsetTop
							) < 0
						) {
							break;
						} else {
							visible = i;
						}
					}
				}
			}
		}
	}

	handleScrollToBottom() {
		shouldScrollToBottom = false;
		this.scroll_to_bottom();
	}

	getReadLast() {
		if (this.state.channelTitle && this.state.instanceTitle) {
			OrgResources.getChannelInstanceChatTime(
				this.state.username,
				this.state.orgId,
				this.state.channelTitle,
				this.state.instanceTitle
			).then((response) => {
				this.setState({ readLast: response.data });
				console.log(response.data)
			});
		}
	}

	componentDidMount() {
		this.myConnect();

		this.getReadLast();

		this.setState({
			currentTime: new Date().toLocaleString(),
		});
		this.timerID = setInterval(
			() =>
				this.state.bellRing
					? this.setState({
							bellRing: false,
					  })
					: "",
			10000
		);
	}
	render() {
		return (
			<div className="chat-component">
				{this.state.instanceTitle ? (
					<Container fluid style={{height: "100%"}} className="pr-0">
						<h2 className="title-header border-bottom">
							{this.state.instanceTitle}
						</h2>

						<div className="d-flex window-body w-100">
							<Container className="ml-0 mr-0 pl-0 flex-fill pr-0">
								<Container fluid className="pr-0" style={{height: "90%"}}>
									<MessagesListComponent
										instance_member_details={instance_member_details}
										messages={messages}
										readLast={this.state.readLast}
										handleScroll={this.handleScroll}
										setMessageCounter={this.setMessageCounter}
										oldMessageLength={oldMessageLength}
										shouldScrollToBottom={shouldScrollToBottom}
										scrollToBottom={this.handleScrollToBottom}
									/>
								</Container>
								<MessageInputComponent
									handleSendMessage={this.handleSendMessage}
									send_message={this.sendMessage}
								/>
							</Container>
							<Container
								fluid
								className="pl-0 pr-0 ml-0 mr-0 h-100 flex-fill"
								style={{minWidth: "150px", maxWidth: "300px"}}>
								<ChatTabbedSidebarComponent
									instance_member_details={instance_member_details}
								/>
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
