import "./navbar.css"

export function NavBar() {
    return (
        <div className="navBar">
            <h1><span>sky</span>Fonix</h1>
            <div className="navigationGroup">
                <a href="#home">Home</a>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
            </div>
        </div>
    )
}