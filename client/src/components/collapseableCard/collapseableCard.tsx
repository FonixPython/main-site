import "./collapseableCard.css"
import { useState } from "react"

export function CollapseableCard(props) {
    const [opened, setOpened] = useState(false)
    return (
        <div className="collapseableCard">
            <div className="handleBar">
                <h2>{props.title}</h2>
                <button onClick={() => { setOpened(!opened) }}><img src="dropDown.png" className={opened ? "upsideDown" : ""} /></button>
            </div>
            <hr />
            <div className="content">
                {opened && props.children}
            </div>
        </div>
    )
}