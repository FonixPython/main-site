import { useState, useEffect, useRef } from "react"
import "./navbar.css"
import { Link } from "react-router-dom"
import { HashLink } from 'react-router-hash-link'

export function NavBar(props) {
    const MOBILE_WIDTH = 750
    const [opened, setOpened] = useState(false)

    // The handling of the mobile resizing is from: https://dev.to/musselmanth/re-rendering-react-components-at-breakpoint-window-resizes-a-better-way-4343
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_WIDTH)
    const prevWidth = useRef(window.innerWidth)
    useEffect(() => {
        const handleResize = () => {
            const currWidth = window.innerWidth
            if (currWidth <= MOBILE_WIDTH && prevWidth.current > MOBILE_WIDTH) {
                setIsMobile(true)
            } else if (currWidth > MOBILE_WIDTH && prevWidth.current <= MOBILE_WIDTH) {
                setIsMobile(false)
            }
            prevWidth.current = currWidth
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <>
            <div className="navBar">
                <Link to="/" className="Link"><img src="logo.webp" alt="skyFonix logo with sky in blue" style={{ height: "3.5rem" }} /></Link>
                <div className="navigationGroup">
                    <Link to="/">Home</Link>
                    <HashLink smooth to="/#projects">Projects</HashLink>
                    <Link to="/gallery">Gallery</Link>
                    <HashLink smooth to="/#about">About</HashLink>
                </div>
                <div style={{ right: 0, margin: "10px", position: "fixed", height: "100%", display: "flex", alignItems: "center" }}>
                    {isMobile && <button className="collapseNavButton" onClick={() => { setOpened(!opened) }}><img src="menu.webp" alt="Hamburger menu icon" /></button>}
                    {!isMobile && props.children}
                </div>
            </div>
            {isMobile && <div className="mobileNavigation" style={{ display: opened ? "flex" : "none", animation: "showMobileNavigation 0.2s cubic-bezier(0.075, 0.82, 0.165, 1)" }}>
                <Link to="/">Home</Link>
                <HashLink smooth to="/#projects">Projects</HashLink>
                <Link to="/gallery">Gallery</Link>
                <HashLink smooth to="/#about">About</HashLink>
                {props.children}
            </div>}
        </>
    )
}