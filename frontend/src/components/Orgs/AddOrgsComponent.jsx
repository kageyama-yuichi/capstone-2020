import React, {Component} from 'react'
import OrgsResources from './OrgsResources.js'
import AuthenticationService from '../Authentication/AuthenticationService.js'
import './OrgsComponent.css'

class AddOrgsComponent extends Component {
	constructor (props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			org_id: '',
			org_title: '',
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
		if(this.state.org_id.length < 3 || this.state.org_id === "new" || this.state.org_id === "channels") { 
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
				let org = {
					org_id: this.state.org_id,
					org_title: this.state.org_title,
					channels: [],
					members: []
				}
				console.log(org);
				OrgsResources.create_org(this.state.username, org).then(() => this.props.history.goBack());
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
			for(let i=0; i<response.data.length; i++){
				this.state.owned_ids.push({
					org_id: response.data[i],
				})
				this.setState({
					owned_ids: this.state.owned_ids
				})
			}
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
				<input
					id="org_create"
					type="button"
					value="Create Organisation"
					onClick={this.on_submit}
				/>
			</div>
        )
    }
}

export default AddOrgsComponent
