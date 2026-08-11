import { useState } from "react"
import "./socialEditorCard.css"

export function SocialEditorCard(props) {
    const [social, setSocial] = useState(props.social)

    async function saveChanges() {
        const result = await fetch("/api/editSocial", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(social)
        })
        if (result) { console.log() }
    }
    async function cancelChanges() {
        setSocial(props.social)
    }

    async function deleteSocial() {
        const result = fetch("/api/deleteSocial", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: social.id })
        })
        if (props.deletionCallback && result) { props.deletionCallback() }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setSocial(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className="socialEditorCard">
            <a href={social.url} target="_blank">
                <div className="socialsButton">
                    <img src={social.iconUrl} alt={"Logo of " + social.name} />
                    {social.name}
                </div>
            </a>
            <div className="socialChanger">
                <input type="text" name="name" value={social.name} onChange={handleChange} />
                <input type="text" name="iconUrl" value={social.iconUrl} onChange={handleChange} />
                <input type="text" name="url" value={social.url} onChange={handleChange} />

                <button onClick={saveChanges}>Save</button>
                <button onClick={cancelChanges}>Cancel</button>
                <button onClick={deleteSocial}>Delete</button>
            </div>
        </div>
    )
}