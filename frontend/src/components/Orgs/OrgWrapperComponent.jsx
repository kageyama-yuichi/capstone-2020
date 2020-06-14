import React, {Component} from "react";
import ChannelListComponent from "./ChannelInstanceListComponent";
import AuthenticationService from "../Authentication/AuthenticationService.js";
import ChatComponent from "../Chat/ChatComponent";
import ChannelAgendaComponent from "./ChannelAgendaComponent.jsx";
class OrgWrapperComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			orgId: this.props.match.params.org_id,
			channelTitle: props.location.state ? props.location.state.channel_title : "",
			instanceTitle: props.location.state ? props.location.state.instance_title : "",
			role: null,
			instanceSelected: true,
		};
		this.handleInstanceClick = this.handleInstanceClick.bind(this);
		this.handleTodoClick = this.handleTodoClick.bind(this);
	}

	handleInstanceClick(channel_title, instance_title) {
		this.setState({
			instanceSelected: true,
			channel_title: channel_title,
			instance_title: instance_title,
		});

		this.forceUpdate();
	}

	handleTodoClick(channel_title, role) {
		this.setState({
			instanceSelected: false,
			channel_title: channel_title,
			role: role,
		});

		this.forceUpdate();
	}

	render() {
		return (
			<div className="app-window">
				<div className="d-flex">
					<ChannelListComponent
						{...this.props}
						todoCallback={this.handleTodoClick}
						callback={this.handleInstanceClick}
						orgId={this.state.orgId}
					/>
					{this.state.instanceSelected ? (
						<ChatComponent
							{...this.props}
							org_id={this.state.orgId}
							channel_title={this.state.channelTitle}
							instance_title={this.state.instanceTitle}
						/>
					) : (
						<div className="w-100">
							<ChannelAgendaComponent
								orgId={this.state.orgId}
								channelTitle={this.state.channelTitle}
								role={this.state.role}
							/>
						</div>
					)}
				</div>
			</div>
		);
	}
}
export default OrgWrapperComponent;
