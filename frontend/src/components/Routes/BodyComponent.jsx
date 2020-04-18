import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ErrorComponent from '../Error/ErrorComponent.jsx'
import LandingComponent from '../Landing/LandingComponent.jsx'

import ChatComponent from '../Chat/ChatComponent.jsx'

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

import TodoComponent from '../Todo/TodoComponent.jsx'
import AddUpdateTodoComponent from '../Todo/AddUpdateTodoComponent.jsx'


class BodyComponent extends Component {
    render() {
        return (
            <div className="BodyComponent">
                <Router>
                    <>
                        {<SidebarComponent/>}
                        <Switch>
                            <Route path="/" exact component={LandingComponent} />
							<Route path="/orgs/" exact component={OrgsComponent} />
							<Route path="/orgs/new" exact component={AddOrgsComponent} />
							<Route path="/orgs/:org_id" exact component={UpdateOrgsComponent} />
							<Route path="/orgs/:org_id/channels" exact component={ChannelsComponent} />
							<Route path="/orgs/:org_id/new" exact component={AddChannelsComponent} />
							<Route path="/orgs/:org_id/:channel_title" exact component={UpdateChannelsComponent} />
							<Route path="/orgs/:org_id/:channel_title/instances" exact component={InstancesComponent} />
							<Route path="/orgs/:org_id/:channel_title/new" exact component={AddInstancesComponent} />
							<Route path="/orgs/:org_id/:channel_title/:instance_title/" exact component={UpdateInstancesComponent} />
							<Route path="/chat/:orgs_id/:channel_title/:instance_title/" exact component={ChatComponent} />
                            <Route path="/dashboard" exact component={DashboardComponent} />
                            //<Route path="/dashboard/" exact component={TodoComponent} />
                            <Route path="/dashboard/:id" exact component={AddUpdateTodoComponent} />
                            <Route path="/profile" exact component={ProfileComponent} />
                            <Route path="/agenda" exact component={AgendaComponent} />

                            <Route component={ErrorComponent} />
                        </Switch>
                        {/* <FooterComponent/> */}
                    </>
                </Router>
            </div>
        )
    }
}

export default BodyComponent
