import React, {Component} from 'react'
import OrgsResources from '../../OrgsResources.js'
import AuthenticationService from '../../../Authentication/AuthenticationService.js'
import '../../OrgsComponent.css'

/*
	Left to do:
	Display the Delete Button Only for ORG_OWNER
	Display the Update Button Only for ORG_OWNER and ADMIN
*/

class InstancesComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: this.props.match.params.org_id,
			channel_title: this.props.match.params.channel_title,
			instances: []
		};
		this.handle_open_chat = this.handle_open_chat.bind(this);
	}

	handle_create_instance = () => {
		var url = this.props.history.location.pathname.slice(0, this.props.history.location.pathname.length-10)+'/new';
		this.props.history.push(url);
	}
		
	handle_open_chat = (instance_title) => {
		let url = "/chat/"+this.state.org_id+"/"+this.state.channel_title+"/"+instance_title;
		this.props.history.push(url);
	}
	
	componentDidUpdate() {
		console.log(this.state.orgs);
	}
	
	refresh_instances = () => {
		// Retrieves All Instances from the Org Data
		OrgsResources.retrieve_org(this.state.username, this.state.org_id)
		.then(response => 
		{	
			console.log(response.data.channels);
			// Maps the Response Data (Channels.class) to JSONbject
			for (let i = 0; i < response.data.channels.length; i++) {
				if(response.data.channels[i].channel_title === this.state.channel_title){
					// Map the Response Data (Instances.class) to JSONObject
					for(let j = 0; j < response.data.channels[i].instances.length; j++){
						console.log(response.data.channels[i]);
						this.state.instances.push({
							instance_title: response.data.channels[i].instances[j].instance_title,
							type: response.data.channels[i].instances[j].type,
						});
						this.setState({
							instances: this.state.instances,
						});
					} 					
				}
			}
		});
	}
	
	componentDidMount() {
		this.refresh_instances();
	}
	
	render() {
		console.log("System - Rendering Page...");
		console.log(this.props.history.location);
        return (
            <div className="InstancesComponent">
				<h1>Instances</h1>
				<input
					className="new_instance"
					type="button"
					value="+"
					onClick={this.handle_create_instance}
				/>
				<div>
				{this.state.instances.map(ins =>
					<h3 key={ins.instance_title} onClick={() => this.handle_open_chat(ins.instance_title)}>{ins.instance_title}</h3>
				)}
				</div>
			</div>
        )
    }
}

export default InstancesComponent
