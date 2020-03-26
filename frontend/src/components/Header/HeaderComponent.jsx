import React, { Component } from 'react'
import { Navbar, NavbarBrand, NavLink, NavItem, Nav } from 'reactstrap'


class HeaderComponent extends Component {
    render() {
        return (
            <header>
                <Navbar expand="md" className="navbar-custom">
                    <NavbarBrand className="navlink-custom" href="https://www.rmit.edu.au/">RMIT</NavbarBrand>
				</Navbar>
			</header>
        )
    }
}

export default HeaderComponent
