import React, { Component } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import "./LandingComponent.css";
import FooterComponent from '../Footer/FooterComponent.jsx'
import RegisterComponent from '../Register/RegisterComponent.jsx'
import logoSVG from "../../assests/Logo_v4.svg";

class LandingComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showRegister: false,
            windowSize: ""
        }
        
        this.newUserOnClickHandler = this.newUserOnClickHandler.bind(this);
    }

    newUserOnClickHandler(){
        this.setState({ showRegister: !this.state.showRegister });
    }

    calcFormSize() {
        let h = document.getElementsByClassName("register-container")[0].offsetHeight +
            document.getElementsByClassName("logo-container")[0].offsetHeight +
            document.getElementsByClassName("login-form")[0].offsetHeight;
        
        let cont = document.getElementsByClassName("cont")[0];
        console.log(this.getBodyHeight());
        if (h <= this.getBodyHeight()) {
            cont.style.height = "100%";

        } else {
            cont.style.height = "fit-content";
            
        }
    }

    handleResize = e => {
        const windowSize = window.innerWidth;
        
        this.calcFormSize();

        this.setState(prevState => {
            return { windowSize };
        });
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.calcFormSize();
    }

    getBodyHeight() {
        return document.getElementsByTagName("body")[0].offsetHeight;
    }

    getBodyWidth() {
        return document.getElementsByTagName("body")[0].offsetWidth;
    }

	render() {
        return (
            <div className="home-page">
            
				<div>
                    <div className="login-container">
                        <div className="cont">
						<div className="logo-container">
							<img className="logo" src={logoSVG}></img>
						</div>
						<form className="login-form">
							<h1 className="login-title">LOGIN</h1>
							<div className="input-container">
								<p>Username</p>
								<input
									type="text"
                                        className="username-field"
                                        placeholder="Enter your username"
								></input>
							</div>
							<div className="input-container">
                                <p>Password</p>
								<input
									type="text"
                                        className="password-field"
                                        placeholder="Enter your password"
								></input>
							</div>
							<div className="password-reset">
								<a>Forgot password?</a>
							</div>

							<input
								type="button"
								formAction="submit"
								className="login-button"
								value="SIGN IN"
							></input>
						</form>
						<div className="register-container">
							<p className="or">or</p>
							<hr></hr>
							<div className="create-account-container">
								<p>
									New user? <a onClick={this.newUserOnClickHandler}>Create a new account</a>
								</p>
							</div>
                        </div>
                        {this.state.showRegister ? <RegisterComponent handler={this.newUserOnClickHandler}/> : null}
                        </div>
                            <FooterComponent /> 
					</div>
                    {window.innerHeight < window.innerWidth && this.getBodyWidth() > 1200 ? <div className="info-container">
                    
                        <p className="motto">THIS MOTTO.</p>
                        <p className="more-motto">
                            I'm baby 3 wolf moon sriracha bespoke shoreditch
                            butcher coloring book. Retro live-edge XOXO man
							braid tofu scenester, umami listicle pok pok.{" "}
                        </p>
                    </div> : null}
				</div>
			</div>
		);
	}
}

export default LandingComponent;
