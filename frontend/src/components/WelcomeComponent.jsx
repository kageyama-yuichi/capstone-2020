import React, { Component } from 'react'

class WelcomeComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            statechange: false
        }
        this.handler = this.handler.bind(this);
    }

    handler() {
        this.setState({ state: this.state });
    }

    render() {
        return (
            <>
            </>
        )
    }
}


export default WelcomeComponent
