import { useState, type ReactNode } from "react"
import React from "react"
import "./sidebarDashboard.css"



export function SidebarDashboard({ children }: React.PropsWithChildren) {
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const pages = React.Children.toArray(children)
        .filter(React.isValidElement<DashPageInterface>)
        .map((element) => ({
            title: element.props.title,
            iconPath: element.props.iconPath,
            children: element.props.children,
        }));

    return (
        <div className="sidebarDashboard">
            <div className="sideBar">
                {pages.map((page, index) => (
                    <button className={index == selectedIndex ? "selectedPage" : ""} onClick={() => { setSelectedIndex(index) }} key={page.title}>
                        <img src={page.iconPath} alt="Page icon" />
                        <p>{page.title}</p>
                    </button>
                ))}
            </div>
            <div className="pageContent">
                {pages[selectedIndex]?.children}
            </div>
        </div>
    )
}

interface DashPageInterface {
    title: string,
    iconPath: string,
    children: ReactNode
}

export function DashPage({ title, iconPath, children }: DashPageInterface) {
    console.log(title)
    console.log(iconPath)
    return children
}