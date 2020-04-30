import React, {Component} from "react";
import {Container} from "react-bootstrap";

class ContactComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            contactList: []
        }
    }

    componentDidMount() {
        //Getting contact list here 
    }

    render() {
        console.log("rendering contacts")
		return (
			<div className="app-window">
				<Container fluid className="h-100">
                    <h1>
                        this is a header
                    </h1>
				</Container>
			</div>
		);
	}
}

export default ContactComponent;
