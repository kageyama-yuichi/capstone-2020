import React, {Component} from "react";
import {ListGroup, Button, ButtonGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import MemberListComponent from "./MemberListComponent.jsx";

const org_member_details = new Map();

class ChannelListComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			memberListOpen: [],
			channels: props.channels,
		};
		props.org_member_details.forEach((value, key) => org_member_details.set(key, value));
	}

	componentDidMount() {
		this.state.channels.map((channel) => {
			this.state.memberListOpen[channel.channel_title] = false;
		});
	}

	toggleMemberListDisplay(channel_title) {
		this.state.memberListOpen[channel_title] = !this.state.memberListOpen[channel_title];
		this.forceUpdate();
	}

	componentDidUpdate(prevProps) {
		if (this.props.channels !== prevProps.channels) {
			this.setState({channels: this.props.channels});
		}
	}

	render() {
		return (
			<ListGroup className="overflow-auto">
				{this.state.channels.map((ch) => (
					<ListGroup.Item
						key={ch.channel_title}
						className="channels bg-primary text-white">
						<div className="d-flex justify-content-between">
							{ch.channel_title}
							<ButtonGroup className="align-self-end">
								<OverlayTrigger delay={{ show: 400, hide: 0 }}
									placement="bottom"
									overlay={<Tooltip>Members</Tooltip>}>
									<Button
										variant="secondary"
										className="btn-sm"
										onClick={() =>
											this.toggleMemberListDisplay(ch.channel_title)
										}>
										{this.state.memberListOpen[ch.channel_title] ? (
											<i className="fas fa-angle-up"></i>
										) : (
											<i className="fas fa-caret-down"></i>
										)}
									</Button>
								</OverlayTrigger>
								<OverlayTrigger delay={{ show: 400, hide: 0 }}
									placement="bottom"
									overlay={<Tooltip>Add Users</Tooltip>}>
									<Button
										variant="success"
										className="btn-sm"
										onClick={() =>
											this.props.add_users_to_channel(ch.channel_title)
										}>
										<i className="fas fa-user-plus"></i>
									</Button>
								</OverlayTrigger>
								<OverlayTrigger delay={{ show: 400, hide: 0 }}
									placement="bottom"
									overlay={<Tooltip>Remove Users</Tooltip>}>
									<Button
										variant="danger"
										className="btn-sm"
										onClick={() =>
											this.props.remove_users_from_channel(ch.channel_title)
										}>
										<i className="fas fa-user-minus"></i>
									</Button>
								</OverlayTrigger>
								<OverlayTrigger delay={{ show: 400, hide: 0 }}
									placement="bottom"
									overlay={<Tooltip>Edit Channel</Tooltip>}>
									<Button
										variant="dark"
										className="btn-sm"
										onClick={() => this.props.handle_update_channel(ch)}>
										<i className="fas fa-edit"></i>
									</Button>
								</OverlayTrigger>
								<OverlayTrigger delay={{ show: 400, hide: 0 }}
									placement="bottom"
									overlay={<Tooltip>Delete Channel</Tooltip>}>
									<Button
										className="btn-sm"
										variant="warning"
										onClick={() =>
											this.props.handle_delete_channel(ch.channel_title)
										}>
										<i className="fas fa-trash"></i>
									</Button>
								</OverlayTrigger>
							</ButtonGroup>
						</div>

						<ListGroup
							style={{
								display: this.state.memberListOpen[ch.channel_title]
									? "flex"
									: "none",
							}}>
							<MemberListComponent
								show_buttons={false}
								remove_member={this.props.remove_member}
								username={this.state.username}
								members={ch.members}
								org_member_details={org_member_details}
							/>
						</ListGroup>
					</ListGroup.Item>
				))}
			</ListGroup>
		);
	}
}
export default ChannelListComponent;
