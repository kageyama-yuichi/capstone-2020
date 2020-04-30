import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import AuthenticatedRoute from '../Authentication/AuthenticatedRoute.jsx'

import ErrorComponent from '../Error/ErrorComponent.jsx'
import LandingComponent from '../Landing/LandingComponent.jsx'

import ChatComponent from '../Chat/ChatComponent.jsx'
import PrivateChatComponent from '../Chat/PrivateChatComponent.jsx'

import OrgsComponent from '../Orgs/OrgsComponent.jsx'
import AddOrgsComponent from '../Orgs/AddOrgsComponent.jsx'
import UpdateOrgsComponent from '../Orgs/UpdateOrgsComponent.jsx'

import ChannelsComponent from '../Orgs/Channels/ChannelsComponent.jsx'
import AddChannelsComponent from '../Orgs/Channels/AddChannelsComponent.jsx'
import UpdateChannelsComponent from '../Orgs/Channels/UpdateChannelsComponent.jsx'

import InstancesComponent from '../Orgs/Channels/Instances/InstancesComponent.jsx'
import AddInstancesComponent from '../Orgs/Channels/Instances/AddInstancesComponent.jsx'
import UpdateInstancesComponent from '../Orgs/Channels/Instances/UpdateInstancesComponent.jsx'

import DashboardComponent from '../Dashboard/DashboardComponent.jsx'
import SidebarComponent from '../Sidebar/SidebarComponent.jsx'
import AgendaComponent from '../Agenda/AgendaComponent.jsx'
import ProfileComponent from '../Profile/ProfileComponent.jsx'
import PasswordChangeComponent from "../PasswordChange/PasswordChangeComponent.jsx";



class BodyComponent extends Component {
    render() {
        return (
            <div className="BodyComponent">
                <Router>
                    <>
                        {<SidebarComponent/>}
                        <Switch>
                            <Route path="/" exact component={LandingComponent} />
							
							<AuthenticatedRoute path="/orgs/" exact component={OrgsComponent} />
							<AuthenticatedRoute path="/orgs/new" exact component={AddOrgsComponent} />
							<AuthenticatedRoute path="/orgs/:org_id" exact component={UpdateOrgsComponent} />
							<AuthenticatedRoute path="/orgs/:org_id/channels" exact component={ChannelsComponent} />
							<AuthenticatedRoute path="/orgs/:org_id/new" exact component={AddChannelsComponent} />
							<AuthenticatedRoute path="/orgs/:org_id/:channel_title" exact component={UpdateChannelsComponent} />
							<AuthenticatedRoute path="/orgs/:org_id/:channel_title/instances" exact component={InstancesComponent} />
							<AuthenticatedRoute path="/orgs/:org_id/:channel_title/new" exact component={AddInstancesComponent} />
							
                            <AuthenticatedRoute path="/chat/:orgs_id/:channel_title/:instance_title" exact component={ChatComponent} />
                            <AuthenticatedRoute path="/orgs/:org_id/:channel_title/:instance_title" exact component={UpdateInstancesComponent} />

							<AuthenticatedRoute path="/private/:receiver" exact component={PrivateChatComponent} />

							<AuthenticatedRoute path="/dashboard" exact component={DashboardComponent} />

							<AuthenticatedRoute path="/profile" exact component={ProfileComponent} />
                            <AuthenticatedRoute path="/profile/password" exact component={PasswordChangeComponent}/>

							<AuthenticatedRoute path="/agenda" exact component={AgendaComponent} />

                            <AuthenticatedRoute component={ErrorComponent} />
                        </Switch>
                        {/* <FooterComponent/> */}
                    </>
                </Router>
            </div>
        )
    }
}

export default BodyComponent
