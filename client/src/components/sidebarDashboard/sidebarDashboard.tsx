import { useEffect, useState } from "react"
import "./sidebarDashboard.css"



export function SidebarDashboard({ children }: React.PropsWithChildren) {
    const [pages, setPages] = useState<DashPageInterface[]>([])
    const [selectedIndex,setSelectedIndex] = useState<>(0)
    const list: DashPageInterface[] = []
    if (children) {
        children.map((element) => (list.push({ title: element.props.title, children: element.props.children, iconPath: element.props.children })))
    }
    setPages(list)
    return (
        <main>
            <div className="sideBar">

            </div>
            <div className="pageContent">

            </div>
        </main>
    )
}

interface DashPageInterface extends React.PropsWithChildren {
    title: string,
    iconPath: string
}

export function DashPage({ title, iconPath, children }: DashPageInterface) {
    return children
}