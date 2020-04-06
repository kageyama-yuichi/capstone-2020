import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ErrorComponent from '../Error/ErrorComponent.jsx'
import LandingComponent from '../Landing/LandingComponent.jsx'
import ChatComponent from '../Chat/ChatComponent.jsx'
import DashboardComponent from '../Dashboard/DashboardComponent.jsx'
import SidebarComponent from '../Sidebar/SidebarComponent.jsx'
import ProfileComponent from '../Profile/ProfileComponent.jsx'

class BodyComponent extends Component {
    render() {
        return (
            <div className="BodyComponent">
                <Router>
                    <>
                        {<SidebarComponent/>}
                        <Switch>
                            <Route path="/" exact component={LandingComponent} />
							<Route path="/chat" exact component={ChatComponent} /> {/* Should be Replaced with List of Organisations */} 
							<Route path="/chat/:group_id" exact component={ChatComponent} />
                            <Route path="/dashboard" exact component={DashboardComponent} />
                            <Route path="/profile" exact component={ProfileComponent} />
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
