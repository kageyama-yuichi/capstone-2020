import React, { Component } from 'react'
import "./AgendaComponent.css"
import TodoComponent from "../Todo/TodoComponent.jsx"

class AgendaComponent extends Component {
    render() {
        return (
            <div className="app-window agenda-component">
                <TodoComponent/>
            </div>
        )
    }
}

export default AgendaComponent