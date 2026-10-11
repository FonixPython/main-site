import { ChevronDown } from "pixelarticons/react"
import "./collapseableCard.css"
import { useState } from "react"

interface CollapseableCardProps extends React.PropsWithChildren {
    title: string
}

export function CollapseableCard({ title, children }: CollapseableCardProps) {
    const [opened, setOpened] = useState(false)
    return (
        <div className="collapseableCard">
            <div className="handleBar">
                <p>{title}</p>
                <button onClick={() => { setOpened(!opened) }}><ChevronDown className={opened ? "upsideDown" : ""} /></button>
            </div>
            <hr />
            <div className="content">
                {opened && children}
            </div>
        </div>
    )
}