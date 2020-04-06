import React, { Component } from "react";
import "./SidebarComponent.css";
import AgendaIcon from "../../assests/AgendaIcon.svg";
import ChatIcon from "../../assests/ChatIcon.svg";
import LogoIcon from "../../assests/LogoIcon_v4.svg";
import LogoutIcon from "../../assests/LogoutIcon.svg";
import ProfileIcon from "../../assests/ProfileIcon.svg";
// import SettingsIcon from "../../assests/SettingsIcon.svg";
import TeamsIcon from "../../assests/TeamsIcon.svg";
import { Link } from "react-router-dom";

class SidebarComponent extends Component {
	render() {
		//Do not load sidebar on landing page
		if (window.location.pathname === '/') {
			return null;
		} else {
			return (
				<nav className="sidebar">
					<ul className="sidebar-nav">
						<li className={(window.location.pathname == `/dashboard` ? "current-window": "") + " sidebar-item logo-item"}>
							<Link to="/dashboard" className="nav-link">
								<img src={LogoIcon}></img>
							</Link>
						</li>
							<Link to="/profile" className="nav-link">
						<li className={(window.location.pathname == `/profile` ? "current-window": "") + " sidebar-item"}>
								<img src={ProfileIcon}></img>
								<span className="link-text">Profile</span>
							</Link>
						</li>
						<li className={(window.location.pathname == `/orgs` ? "current-window": "") + " sidebar-item"}>
							<Link to="/chat" className="nav-link">
								<img src={TeamsIcon}></img>
								<span className="link-text">Orgs</span>
							</Link>
						</li>
						<li className={(window.location.pathname == `/agenda` ? "current-window": "") + " sidebar-item"}>
							<Link to="/dashboard" className="nav-link">
								<img src={AgendaIcon}></img>
								<span className="link-text">Agenda</span>
							</Link>
						</li>
						<li className={(window.location.pathname == `/private` ? "current-window": "") + " sidebar-item"}>
							<Link to="/dashboard" className="nav-link">
								<img src={ChatIcon}></img>
								<span className="link-text">Private</span>
							</Link>
						</li>

						<li className="sidebar-item">
							<Link to="/" className="nav-link">
								<img src={LogoutIcon}></img>
								<span className="link-text">Logout</span>
							</Link>
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
