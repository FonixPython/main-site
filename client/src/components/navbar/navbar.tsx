import "./navbar.css"
import { Link } from "react-router-dom"
import { HashLink } from 'react-router-hash-link'

export function NavBar(props) {
    return (
        <div className="navBar">
            <Link to="/" className="Link"><img src="logo.webp" alt="skyFonix logo with sky in blue" style={{ height: "3.5rem" }} /></Link>
            <div className="navigationGroup">
                <Link to="/">Home</Link>
                <HashLink smooth to="/#projects">Projects</HashLink>
                <Link to="/gallery">Gallery</Link>
                <HashLink smooth to="/#about">About</HashLink>
            </div>
            <div style={{ right: 0, margin: "10px", position: "fixed" }}>
                {props.children}
            </div>
        </div>
    )
}