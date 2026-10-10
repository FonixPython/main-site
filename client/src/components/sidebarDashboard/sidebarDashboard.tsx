import { useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom";
import React from "react"
import "./sidebarDashboard.css"



export function SidebarDashboard({ children }: React.PropsWithChildren) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const pages = React.Children.toArray(children)
        .filter(React.isValidElement<DashPageInterface>)
        .map((element) => ({
            title: element.props.title,
            icon: element.props.icon,
            children: element.props.children,
        }));

    const navigate = useNavigate();

    async function logout() {
        const result = await fetch("/api/logout")
        if (result.status == 200) {
            navigate("/")
        }
    }

    return (
        <div className="sidebarDashboard">
            <div className="sideBar">
                {pages.map((page, index) => (
                    <button className={index == selectedIndex ? "selectedPage" : ""} onClick={() => { setSelectedIndex(index) }} key={page.title}>
                        {page.icon}
                        <p>{page.title}</p>
                    </button>
                ))}
                <button onClick={logout} className="logoutButton">Logout</button>
            </div>
            <div className="pageContent">
                {pages[selectedIndex]?.children}
            </div>
        </div>
    )
}

interface DashPageInterface {
    title: string,
    icon: ReactNode,
    children: ReactNode
}

export function DashPage({ title, icon, children }: DashPageInterface) {
    console.log(title, icon)
    return children
}