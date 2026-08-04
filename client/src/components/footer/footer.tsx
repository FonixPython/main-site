import "./footer.css"
import { Link } from "react-router-dom"

export function Footer() {
    let date = new Date()
    return (
        <div className="footer">
            @{date.getFullYear()} Source code: <a href="https://github.com/FonixPython/main-site">main-site</a>
            <Link to="/dash" id="footerRedirect">Admin dashboard</Link>
        </div>
    )
}