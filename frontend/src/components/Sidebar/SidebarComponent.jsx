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
import AuthenticationService from '../Authentication/AuthenticationService.js'

class SidebarComponent extends Component {
	onClick() {
		AuthenticationService.logout();
		this.props.history.replaceState("/")
	}

	render() {
		//Do not load sidebar on landing page
		if (window.location.pathname === '/') {
			return null;
		} else {
			return (
				<nav className="sidebar">
					<ul className="sidebar-nav">
						<li className={(window.location.pathname === `/dashboard` ? "current-window": "") + " sidebar-item logo-item"}>
							<Link to="/dashboard" className="nav-link">
								<img className="logo-img" src={LogoIcon} alt="DashboardIcon"></img>
							</Link>
						</li>
							
						<li className={(window.location.pathname === `/profile` ? "current-window" : "") + " sidebar-item"}>
							<Link to="/profile" className="nav-link">
								<img src={ProfileIcon} alt="ProfileIcon"></img>
								<span className="link-text">Profile</span>
							</Link>
						</li>
						<li className={(window.location.pathname === `/orgs` ? "current-window": "") + " sidebar-item"}>
							<Link to="/orgs" className="nav-link">
								<img src={TeamsIcon} alt="TeamsIcon"></img>
								<span className="link-text">Orgs</span>
							</Link>
						</li>
						<li className="sidebar-item">
							<Link to="/agenda" className="nav-link">
								<img src={AgendaIcon} alt="AgendaIcon"></img>
								<span className="link-text">Agenda</span>
							</Link>
						</li>
						<li className={(window.location.pathname === `/private` ? "current-window": "") + " sidebar-item"}>
							<Link to="/private" className="nav-link">
								<img src={ChatIcon} alt="ChatIcon"></img>
								<span className="link-text">Private</span>
							</Link>
						</li>

						<li className="sidebar-item">
							<Link to="/" className="nav-link" onClick={this.onClick}>
								<img src={LogoutIcon} alt="LogoutIcon"></img>
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
