import "./navbar.css"

export function NavBar() {
    return (
        <div className="navBar">
            <h1 id="home"><span>sky</span>Fonix</h1>
            <div className="navigationGroup">
                <a href="#home">Home</a>
                <a href="#projects">Projects</a>
                <a href="#About">About</a>
            </div>
        </div>
    )
}