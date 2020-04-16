import React, {Component} from 'react'
import OrgsResources from '../../OrgsResources.js'
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
			username: this.props.match.params.username,
			org_id: this.props.match.params.org_id,
			channel_title: this.props.match.params.channel_title,
			instances: []
		};
	}

	handle_create_instance = () => {
		var url = this.props.history.location.pathname.slice(0, this.props.history.location.pathname.length-10)+'/new';
		this.props.history.push(url);
	}
		
	componentDidUpdate() {
		console.log(this.state.orgs);
	}
	
	refresh_instances = () => {
		// Retrieves All Instances from the Org Data
		OrgsResources.retrieve_all_instance_titles(this.state.username, this.state.org_id, this.state.channel_title)
		.then(response => 
		{
			this.setState({
				instances: response.data.instances
			});
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
				{this.state.instances.map(ins =>
					<div key={ins.instance_title} className='instances'>
						<h3 key={ins.instance_title}>{ins.instance_title}</h3>
					</div>
				)}
			</div>
        )
    }
}

export default InstancesComponent
