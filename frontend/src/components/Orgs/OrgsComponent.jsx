import React, {Component} from 'react'
import OrgsResources from './OrgsResources.js'

class OrgsComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: this.props.match.params.username,
			orgs: []
		};
	}
	
	componentDidUpdate() {
		if (this.state.error) {
			throw new Error('Unable to connect to chat room server.');
		}
		console.log(this.state.orgs);
	}

	componentDidMount() {
		// Retrieves the Organisations of the User from the Server
		OrgsResources.retrieve_orgs(this.state.username)
		.then(response => 
		{
			// Maps the Response Data (Orgs.class) to JSObject
			for(let i=0; i<response.data.length; i++){
				this.state.orgs.push({
					org_id: response.data[i].org_id,
					org_title: response.data[i].org_title,
					members: response.data[i].members
				})
				this.setState({
					orgs: this.state.orgs
				})
			}
		}
		);
	}
	
	render() {
		console.log("System - Rendering Page...");
        return (
            <div className="OrgComponent">
				<h1>L8Z Organisations</h1>
				
				<h2>Your Organisations</h2>
				{this.state.orgs.map(org =>
					<div>
						<h3 key={org.org_id}>{org.org_title}</h3>
						<div>
							{org.members.map(member =>
								<p>{member.username}</p>
							)}
						</div>
					</div>
				)}
			</div>
        )
    }
}

export default OrgsComponent
