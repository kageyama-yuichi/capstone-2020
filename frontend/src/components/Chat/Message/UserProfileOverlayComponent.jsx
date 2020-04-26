import React, {Component} from "react";
import {Image, Popover, Button, Container} from "react-bootstrap";
import tempImg from "../../../assests/ProfileIcon.svg";
import "./UserProfileOverlayComponent.css";

class UserProfileOverlayComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<Popover {...this.props} id="123">
				<Popover.Content
					style={{overflowY: "auto", maxHeight: "500px", minWidth: "350px"}}
					className="user-profile mb-0 bg-dark">
					<Container fluid className="text-white d-flex flex-column align-items-center">
						<Image
							className="unselectable"
							height="80px"
							width="80px"
							style={{objectFit: "cover"}}
							src={tempImg}
							roundedCircle
						/>
						<h5>
							<strong>Name</strong>
						</h5>
						<Container fluid className="text-center pt-3">
							<h6>Bio</h6>
							<p>
								In west Philadelphia born and raised On the playground is where I
								spent most of my days Chillin' out maxin' relaxin' all cool And all
								shootin' some b ball outside of the school When a couple of guys who
								were up to no good Started makin' trouble in my neighborhood I got
								in one little fight and my mon scared And said you're movin' with
								your auntie and uncle in Bel-Air I begged and pleaded with her day
								after day But she packed my suitcase and sent me on my way She give
								me a kiss and then she gave me my ticket Put my walkman on and said
								I might as well kick it First class yo this is bad Drinkin' orange
								juice out of a champagne glass Is this what the people of Bel-Air
								live like Hmmm this might be all right But wait I hear they're
								prissy? and all that Is this the type of place that they should send
								this cool cat I don't think so I'll see when I get there I hope
								they're prepared for the prince of Bel-Air{" "}
							</p>
						</Container>
					</Container>
				</Popover.Content>
				<Popover.Content style={{minWidth: "350px"}} className=" p-0">
					<Button
						style={{borderRadius: "0px"}}
						className="p-1 w-100 rounded-bottom"
						variant="secondary"
						type="button">
						Add to contacts
					</Button>
				</Popover.Content>
			</Popover>
		);
	}
}

export default UserProfileOverlayComponent;
