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
		if (window.location.pathname === '/' || window.location.pathname.indexOf('/recover/password/') != -1) {
			return null;
		} else {
			return (
				<nav className="sidebar">
					<ul className="sidebar-nav">
						<li className={(window.location.pathname === `/dashboard` ? "current-window": "") + " sidebar-item logo-item"}>
							<Link to="/dashboard" className="sidebar-link unselectable">
								<img className="logo-img unselectable " src={LogoIcon} alt="DashboardIcon"></img>
							</Link>
						</li>
							
						<li className={(window.location.pathname === `/profile` ? "current-window" : "") + " sidebar-item"}>
							<Link to="/profile" className="sidebar-link nav-link unselectable">
								<img src={ProfileIcon} className="unselectable" alt="ProfileIcon"></img>
								<span className="link-text">Profile</span>
							</Link>
						</li>
						<li className={(window.location.pathname === `/orgs` ? "current-window": "") + " sidebar-item"}>
							<Link to="/orgs" className="sidebar-link nav-link unselectable">
								<img src={TeamsIcon} className="unselectable" alt="TeamsIcon"></img>
								<span className="link-text">Orgs</span>
							</Link>
						</li>
						<li className={(window.location.pathname === `/agenda` ? "current-window": "") + " sidebar-item"}>
							<Link to="/agenda" className="sidebar-link nav-link unselectable">
								<img src={AgendaIcon} className="unselectable" alt="AgendaIcon"></img>
								<span className="link-text">Agenda</span>
							</Link>
						</li>
						<li className={(window.location.pathname === `/private` ? "current-window": "") + " sidebar-item"}>
							<Link to="/private" className="sidebar-link nav-link unselectable">
								<img src={ChatIcon} className="unselectable" alt="ChatIcon"></img>
								<span className="link-text">Private</span>
							</Link>
						</li>

						<li className="sidebar-item">
							<Link to="/" className="sidebar-link nav-link unselectable" onClick={this.onClick}>
								<img src={LogoutIcon} className="unselectable" alt="LogoutIcon"></img>
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
