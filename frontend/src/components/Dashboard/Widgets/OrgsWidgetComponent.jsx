import React, {Component} from "react";
import {Container, Card, CardDeck, Tabs, Tab} from "react-bootstrap";
import OrgsResources from "../../Orgs/OrgsResources.js";
import AuthenticationService from "../../Authentication/AuthenticationService.js";
import moment from "moment";
import tempImg from "../../../assests/orgImg.svg";
import {Link} from "react-router-dom";

class OrgsWidgetComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			username: AuthenticationService.getLoggedInUserName(),
			currentTitle: "Recent Orgs",
			orgs: [],
		};
	}

	refresh_orgs = () => {
		// Retrieves the Organisations of the User from the Server
		OrgsResources.retrieve_orgs_sql(this.state.username).then((response) => {
			// Maps the Response Data (Orgs.class) to JSObject
			
			var orgs = [];
			var data;
			var date;
			for (let i = 0; i < response.data.length; i++) {
				data = JSON.parse(response.data[i]._data);
				date = moment(response.data[i]._recent_date_time, "LT (DD/MM/YYYY)");
				orgs.push({data: data, date: date});
			}
			//Sort by most recent
			orgs.sort((b, a) => new moment(a.date) - new moment(b.date));
			//Remove all but 6 of the most recent orgs
			orgs.splice(6);
			this.setState({orgs: orgs});
		});
	};

	componentDidMount() {
		this.refresh_orgs();
	}

	render() {
		return (
			<Container fluid className="pl-1 mt-1">
				<Tabs defaultActiveKey="recent">
					<Tab eventKey="recent" title="Recent">
						<CardDeck className="pt-2"style={{overflowY: "auto"}}>
							{this.state.orgs.map((org) => (
								<Card className="org-card mb-1" key={org.data.org_id}>
									<Link
										to={`orgs/${org.data.org_id}/channels`}
										className="cards-fix">
										<Card.Img
											variant="top"
											width="20rem"
											height="140px"
											src={tempImg}
										/>
										<Card.Body>
											<Card.Title>{org.data.org_title}</Card.Title>
										</Card.Body>
										<Card.Footer>
											<small>
												{" "}
												{`Updated ${org.date.format("ll [at] LT")}`}
											</small>
										</Card.Footer>
									</Link>
								</Card>
							))}
						</CardDeck>
					</Tab>
					<Tab eventKey="favourites" title="Favourites"></Tab>
				</Tabs>
			</Container>
		);
	}
}
export default OrgsWidgetComponent;
