import React, {Component} from 'react'
import OrgsResources from './OrgsResources.js'
import AuthenticationService from '../Authentication/AuthenticationService.js'
import './OrgsComponent.css'

/*
	Left to do:
	Work out how to Delete Members
	Work out how to Delete Channels
	Work out how to Invite Members Here
	Work out how to Update a Member Role
	Fix all the this.on_submit() validation
*/

class UpdateOrgsComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			old_org_id: this.props.match.params.org_id,
			org_title: '',
			channels: [],
			members: [],
			org: [],
			owned_ids: [],
			org_id_error: false,
			org_title_error: false
		};
		this.on_submit = this.on_submit.bind(this)
	}
	
	on_submit  = () => {
		console.log(this.state.org_id);
		console.log(this.state.org_title);
		var internal_error = false;
		var str2 = new String(this.state.org_id);
		
		// Ensure Length is 3 or Greater
		if(this.state.org_id.length < 3 || this.state.org_id === "new") { 
			this.setState({
				org_id_error: true
			})
			internal_error = true;
		}
		// Ensure Length is 3 or Greater
		if(this.state.org_title.length < 3) { 
			this.setState({
				org_title_error: true
			})
			internal_error = true;	
		}
		
		if(!internal_error) {
			// Check if the ID Exists
			for(let i=0; i<this.state.owned_ids.length; i++){
				var str1 = new String(this.state.owned_ids[i].org_id);
				// Compare the String Values
				if(str1.valueOf() == str2.valueOf()){
					internal_error = true;
				}
			}
			
			if(internal_error){
				console.log("System - ID Already Used");
				this.setState({
					error: true
				})
			} else {
				console.log("System - Creating New Organisation");
				let org_push = {
					org_id: this.state.org_id,
					org_title: this.state.org_title,
					channels: this.state.channels,
					members: this.state.members
				}
				
				console.log(org_push);
				var url = '/orgs/'+this.state.username;
				OrgsResources.update_org(
					this.state.username, this.state.old_org_id, org_push
				).then(()=> this.props.history.goBack());
			}
		}
	} 
		
    handle_typing_org_id = (event) => {
		// Organisation ID Must Be Lowercase and have NO SPACES and Special Characters
		this.setState({
            org_id: event.target.value.toLowerCase().trim().replace(/[^\w\s]/gi, ""),
			error: false
        });
	}
	handle_typing_org_title = (event) => {
		this.setState({
            org_title: event.target.value,
			error: false
        });
	}
	
	handle_create_channel = () => {
		var url = this.props.history.location.pathname+'/new';
		this.props.history.push(url);
	}
	handle_delete_channel = (channel_title) => {
		console.log("Deleteing");
		OrgsResources.delete_channel(this.state.username, this.state.org_id, channel_title).then(
			response => {
				console.log("Deleted");
				this.setState({
					channels: []
				}, () => {
					// Retrieves All Channels from the Org Data
					OrgsResources.retrieve_org(this.state.username, this.state.old_org_id)
					.then(response => 
					{
						this.setState({
							channels: response.data.channels
						});
					});
				})
			}
		);
		
	}
	handle_update_channel = (channel_title) => {
		var url = this.props.history.location.pathname+"/"+channel_title;
		this.props.history.push(url);
	}
	
	componentDidUpdate() {
		console.log(this.state.org_id);
		console.log(this.state.org_title);
		console.log(this.state.channels);
		console.log(this.state.members);
	}

	componentDidMount() {
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username)
		.then(response => 
		{
			for(let i=0; i<response.data.length; i++){
				// They Can Claim the Same ID
				if(this.state.org_id != response.data[i]){
					this.state.owned_ids.push({
						org_id: response.data[i],
					})
					this.setState({
						owned_ids: this.state.owned_ids
					})
				}
			}
		});
		// Retrieves All the Current Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.old_org_id)
		.then(response => 
		{
			this.setState({
				org_id: response.data.org_id,
				org_title: response.data.org_title,
				channels: response.data.channels,
				members: response.data.members
			});
		});
	}
	
	render() {
		console.log("System - Rendering Page...");
        return (
            <div className="FormOrgComponent">
				<h1>Register an Organisations</h1>
				<h2>Organisation ID</h2>
				<input 
					type="text"
					name="org_id"
					id="org_id"
					value={this.state.org_id}
					onChange={this.handle_typing_org_id}
					placeholder="Organisation ID"
				/>
				<h2>Organisation Title</h2>
				<input 
					type="text" 
					name="org_title"
					id="org_title"
					value={this.state.org_title}
					onChange={this.handle_typing_org_title}
					placeholder="Organisation Title"
				/>
				<h2>{this.state.org_title} Member List</h2>
				{this.state.members.map(member =>
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
				<h1>{this.state.org_title} Channels</h1>
				<input
					className="new_channel"
					type="button"
					value="+"
					onClick={this.handle_create_channel}
				/>
				{this.state.channels.map(ch =>
					<div key={ch.channel_title} className='channels'>
						<input
							className="delete_channel"
							type="button"
							value="-"
							onClick={() => this.handle_delete_channel(ch.channel_title)}
						/>
						<input
							className="update_channel"
							type="button"
							value="#"
							onClick={() => this.handle_update_channel(ch.channel_title)}
						/>
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
				<input
					id="org_update"
					type="button"
					value="Update Organisation"
					onClick={this.on_submit}
				/>
			</div>
        )
    }
}

export default UpdateOrgsComponent
