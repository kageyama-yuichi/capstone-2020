import React, {Component} from 'react'
import OrgsResources from '../OrgsResources.js'
import AuthenticationService from '../../Authentication/AuthenticationService.js'
import '../OrgsComponent.css'

/*
	Left to do:
	Display the Delete Button Only for ORG_OWNER
	Display the Update Button Only for ORG_OWNER and ADMIN
*/

class ChannelsComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channels: []
		};
	}

	handle_create_channel = () => {
		var url = this.props.history.location.pathname.slice(0, this.props.history.location.pathname.length-9)+'/new';
		this.props.history.push(url);
	}
		
	componentDidUpdate() {
		console.log(this.state.orgs);
	}
	
	refresh_channels = () => {
		// Retrieves All Channels from the Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.org_id)
		.then(response => 
		{
			this.setState({
				channels: response.data.channels
			});
		});
	}
	
	componentDidMount() {
		this.refresh_channels();
	}
	
	render() {
		console.log("System - Rendering Page...");
		console.log(this.props.history.location);
        return (
            <div className="ChannelsComponent">
				<h1>Channels</h1>
				<input
					className="new_channel"
					type="button"
					value="+"
					onClick={this.handle_create_channel}
				/>
				{this.state.channels.map(ch =>
					<div key={ch.channel_title} className='channels'>
						<h3 key={ch.channel_title}>{ch.channel_title}</h3>
						<div>
							{ch.members.map(member =>
								{
									if(member.role === "ORG_OWNER"){
										return(<p key={member.username} className='org_owner'>{member.username}</p>)
									} else if(member.role === "ADMIN"){
										return(<p key={member.username} className='admin'>{member.username}</p>)
									}else if(member.role === "TEAM_LEADER"){
										return(<p key={member.username} className='team_leader'>{member.username}</p>)
									} else {
										if(member.role === "TEAM_MEMBER"){
											return(<p key={member.username} className='team_member'>{member.username}</p>)
										}
									}
								}
							)}
						</div>
					</div>
				)}
			</div>
        )
    }
}

export default ChannelsComponent
