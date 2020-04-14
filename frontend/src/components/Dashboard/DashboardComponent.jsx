import React, { Component } from 'react'
import "./DashboardComponent.css"
import TodoComponent from '../Todo/TodoComponent'

class DashboardComponent extends Component {
    render() {
        return (
            <div className="app-window dashboard-component">
                <div className="container">
                    <div className="left">

                    </div>
                    <div className="right">
                        <TodoComponent/>
                    </div>
                </div>
            </div>
        )
    }
}

export default DashboardComponent