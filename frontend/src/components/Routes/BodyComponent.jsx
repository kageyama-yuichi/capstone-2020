import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ErrorComponent from '../Error/ErrorComponent.jsx'
import LandingComponent from '../Landing/LandingComponent.jsx'
import ChatComponent from '../Chat/ChatComponent.jsx'
import OrgsComponent from '../Orgs/OrgsComponent.jsx'
import DashboardComponent from '../Dashboard/DashboardComponent.jsx'
import SidebarComponent from '../Sidebar/SidebarComponent.jsx'

class BodyComponent extends Component {
    render() {
        return (
            <div className="BodyComponent">
                <Router>
                    <>
                        {<SidebarComponent/>}
                        <Switch>
                            <Route path="/" exact component={LandingComponent} />
							<Route path="/orgs/:username" exact component={OrgsComponent} />
							<Route path="/chat/:orgs_id/:channel_title/:instance_title" exact component={ChatComponent} />
                            <Route path="/dashboard" exact component={DashboardComponent} />
                            <Route component={ErrorComponent}/>
                        </Switch>
                        {/* <FooterComponent/> */}
                    </>
                </Router>
            </div>
        )
    }
}

export default BodyComponent
