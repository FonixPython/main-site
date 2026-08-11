import "./aboutEditor.css"
import { useState, useEffect } from "react"


export function AboutEditor() {
    interface aboutInfoInterface {
        title: string,
        pfpUrl: string,
        about: string,
        email: string
    }
    const initialAboutState: aboutInfoInterface = {
        title: "",
        pfpUrl: "",
        about: "",
        email: ""
    };
    const [aboutInfo, setAboutInfo] = useState<aboutInfoInterface>(initialAboutState)

    async function loadAboutInfo() {
        const result = await fetch("/api/getAbout")
        const jsonResult = await result.json()
        setAboutInfo(jsonResult)
    }

    async function saveChanges() {
        const result = await fetch("/api/setAbout", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aboutInfo)
        })
    }

    useEffect(() => {
        loadAboutInfo();
    }, [])

    const onChange = (e) => {
        const { name, value } = e.target
        setAboutInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }
    return (
        <div className="aboutEditor">
            <p>Website title:</p>
            <input type="text" name="title" value={aboutInfo.title || ""} onChange={onChange} />
            <p>Profile Picture URL:</p>
            <input type="text" name="pfpUrl" value={aboutInfo.pfpUrl || ""} onChange={onChange} />
            <p>About me text:</p>
            <textarea name="about" value={aboutInfo.about || ""} onChange={onChange} />
            <p>Email:</p>
            <input type="text" name="email" value={aboutInfo.email || ""} onChange={onChange} />

            <button onClick={saveChanges}>Save</button>
        </div>
    )
}