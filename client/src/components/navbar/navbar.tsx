import "./navbar.css"

export function NavBar(props) {
    return (
        <div className="navBar">
            <h1><span>sky</span>Fonix</h1>
            <div className="navigationGroup">
                {props.children}
            </div>
        </div>
    )
}