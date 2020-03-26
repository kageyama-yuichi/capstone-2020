import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import ErrorComponent from '../Error/ErrorComponent.jsx'
import HeaderComponent from '../Header/HeaderComponent.jsx'
import FooterComponent from '../Footer/FooterComponent.jsx'
import WelcomeComponent from '../WelcomeComponent.jsx'
import LandingComponent from '../Landing/LandingComponent.jsx'

class BodyComponent extends Component {
    render() {
        return (
            <div className="BodyComponent">
                <Router>
                    <>
                        <HeaderComponent/>
                        <Switch>
                            <Route path="/" exact component={LandingComponent}/>
                            <Route component={ErrorComponent}/>
                        </Switch>
                        <FooterComponent/>
                    </>
                </Router>
            </div>
        )
    }
}

export default BodyComponent
