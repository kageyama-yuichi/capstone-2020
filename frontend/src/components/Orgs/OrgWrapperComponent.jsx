import React, {Component} from "react";
import ChannelListComponent from "./ChannelInstanceListComponent";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import ChatComponent from "../Chat/ChatComponent";

class OrgWrapperComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channel_title: props.location.state ? props.location.state.channel_title : "",
			instance_title: props.location.state ? props.location.state.instance_title : "",
			instanceSelected: false
		};
		this.handleInstanceClick = this.handleInstanceClick.bind(this)
	}

	handleInstanceClick(channel_title, instance_title) {
		this.setState({
			instanceSelected: true,
			channel_title: channel_title,
			instance_title: instance_title
		})

		this.forceUpdate();
	}

	render() {
		console.log(this.state.channel_title, this.state.instance_title)
		return (
			<div className="app-window">
				<div className="d-flex">
					<ChannelListComponent {...this.props} callback={this.handleInstanceClick} orgId={this.state.org_id}></ChannelListComponent>
					<ChatComponent {...this.props} org_id={this.state.org_id} channel_title={this.state.channel_title} instance_title={this.state.instance_title}/>
				</div>
			</div>
		);
	}
}
export default OrgWrapperComponent;
