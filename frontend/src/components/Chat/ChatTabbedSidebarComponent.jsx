import React, {Component} from "react";
import {Tabs, Tab} from "react-bootstrap"
class ChatTabbedSidebarComponent extends Component {
	constructor(props) {
		super(props);
        this.state = {};
	}

    mapUsers() {
		let retDiv;
		retDiv = [...this.props.instance_member_details.keys()].map((key) => {
			return (
				<p key={key}>
					<span
						className={
							this.props.instance_member_details.get(key).status === "offline"
								? "offline-dot"
								: "online-dot"
						}></span>{" "}
					{this.props.instance_member_details.get(key).name} @{key} {" "}
					{this.props.instance_member_details.get(key).status === "typing..." ? "..." : ""}
				</p>
			);
		});
		return retDiv;
	}

	render() {
		return (
			<div className="h-100 bg-light">
				<Tabs className="text-light" defaultActiveKey="users">
					<Tab eventKey="users" title="Users">
						<div className="user-list">{this.mapUsers()}</div>
					</Tab>
					<Tab eventKey="pinned" title="Pinned"></Tab>
				</Tabs>
			</div>
		);
	}
}
export default ChatTabbedSidebarComponent;
