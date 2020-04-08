import React, {Component} from 'react'
import OrgsResources from './OrgsResources.js'
import './OrgsComponent.css'

/*
	Left to do:
	Use the OrgsResources.retrieve_org to load in the Orgs Old Data
	Save all the Relevant data in the States
	Figure out How to Properly display Members and Shit
	Work out how to Delete Members
	Work out how to Delete Channels
	Post it Baby
*/
class OrgsComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: this.props.match.params.username,
			org_id: this.props.match.params.org_id,
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
					this.state.username, this.state.org_id, org_push
				).then(()=> this.props.history.push(url));
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
	
	componentDidUpdate() {
	}

	componentDidMount() {
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_all_orgs(this.state.username)
		.then(response => 
		{
			console.log(response.data);
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
		// Retrieves All the Current Organisations IDs
		OrgsResources.retrieve_org(this.state.username, this.state.org_id)
		.then(response => 
		{
			console.log(response);
		});
	}
	
	render() {
		console.log("System - Rendering Page...");
        return (
            <div className="FormOrgComponent">
				<h1>Register an Organisations</h1>
				<input 
					type="text"
					name="org_id"
					id="org_id"
					value={this.state.org_id}
					onChange={this.handle_typing_org_id}
					placeholder="Organisation ID"
				/>
				<input 
					type="text" 
					name="org_title"
					id="org_title"
					value={this.state.org_title}
					onChange={this.handle_typing_org_title}
					placeholder="Organisation Title"
				/>
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

export default OrgsComponent
