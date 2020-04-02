import React, { Component } from "react";
import "./SidebarComponent.css";
import AgendaIcon from "../../assests/AgendaIcon.svg";
import ChatIcon from "../../assests/ChatIcon.svg";
import LogoIcon from "../../assests/LogoIcon_v4.svg";
import LogoutIcon from "../../assests/LogoutIcon.svg";
import ProfileIcon from "../../assests/ProfileIcon.svg";
// import SettingsIcon from "../../assests/SettingsIcon.svg";
import TeamsIcon from "../../assests/TeamsIcon.svg";

class SidebarComponent extends Component {
	

	render() {
		//Do not load sidebar on landing page
		if (window.location.pathname === `/`) {
			return null;
		} else {
			return (
				<nav className="sidebar">
					<ul className="sidebar-nav">
						<li className="sidebar-item logo-item">
							<img src={LogoIcon}></img>
						</li>
						<li className="sidebar-item">
							<div className="nav-link">
								<img src={ProfileIcon}></img>
								<span className="link-text">Profile</span>
							</div>
						</li>
						<li className="sidebar-item">
							<div className="nav-link">
								<img src={TeamsIcon}></img>
								<span className="link-text">Orgs</span>
							</div>
						</li>
						<li className="sidebar-item">
							<div className="nav-link">
								<img src={AgendaIcon}></img>
								<span className="link-text">Agenda</span>
							</div>
						</li>
						<li className="sidebar-item">
							<div className="nav-link">
								<img src={ChatIcon}></img>
								<span className="link-text">Private</span>
							</div>
						</li>

						<li className="sidebar-item">
							<div className="nav-link">
								<img src={LogoutIcon}></img>
								<span className="link-text">Logout</span>
							</div>
						</li>

						{/* <li className="sidebar-item">
									<img src={SettingsIcon}></img>
									<span className="link-text">Settings</span>
								</li> */}
					</ul>
				</nav>
			);
		}
	}
}

export default SidebarComponent;
