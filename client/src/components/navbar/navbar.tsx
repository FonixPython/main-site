import "./navbar.css"
import { Link } from "react-router-dom"

export function NavBar(props) {
    return (
        <div className="navBar">
            <Link to="/" className="Link"><img src="logo.webp" alt="skyFonix logo with sky in blue" style={{ height: "3.5rem" }} /></Link>
            <div className="navigationGroup">
                {props.children}
            </div>
        </div>
    )
}