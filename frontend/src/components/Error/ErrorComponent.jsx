import React, {Component} from "react";
import {Container, Row} from "react-bootstrap";
// Sourced from: https://geekprank.com/fbi-warning/
class ErrorComponent extends Component {
	render() {
		return (
			<div className="app-window org-component">
				<Container fluid className="h-100">
					<Row
						style={{height: "fit-content"}}
						className="header-title border-bottom mb-3 align-items-center"
					>
						<h1>This device has been locked</h1>	
					</Row>
					<Row>
						<div class="description">
							<p><strong>Your operating system has been locked due to the violation of the federal laws of the Global Internet Safety Society. This computer lock is aimed to stop your illegal activity: </strong></p>
							<ol li="reasons">
								<li>This computer contains illegal video video files about chilf pornography and/or zoophilia.</li>
								<li>This computer was used for initiationg conversation about bomb making and other terrorist motives.</li>
							</ol>
							<h2>Understand your rights</h2>
							<ol li="rights">
								<li>You have the right to remain silent.</li>
								<li>The information you provide can and will be used against you in a court of law.</li>
								<li>You have the right to an attorney. If you can't afford an attorney, one will be provided for you.</li>
							</ol>
							<h2>You are bound to do the following</h2>
							<p>
								Now that you understand your rights, remain calm and do not leave the area.
								A SWAT team is on the way to your location. 
								Make sure the door is open, otherwise they are ready to break in.
								Do not destroy any evidence and don't contact your accomplices!
								Prepare disks, flash drives and any other multimedia devices containing illegal materials, proving your criminality.
								Be prepared to answer the question during your interrogation! 
								Cooperate and don't deny the charges against you. 
							</p>
						</div>
						<div id="scrolldown">
						</div>
					</Row>
				</Container>
			</div>
		);
	}
}

export default ErrorComponent;