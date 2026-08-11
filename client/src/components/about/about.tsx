import "./about.css"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";


export function About() {
    const [email, setEmail] = useState("john.doe@example.com")
    const [about, setAbout] = useState("About section text")
    const [pfpUrl, setPfpUrl] = useState("/favicon.ico")
    const [socials, setSocials] = useState([])

    async function loadAbout() {
        const result = await fetch("/api/getAbout")
        const jsonResult = await result.json()
        setEmail(jsonResult.email)
        setAbout(jsonResult.about)
        setPfpUrl(jsonResult.pfpUrl)
        const socialsResult = await fetch("/api/getSocials")
        const socialsResultJson = await socialsResult.json()
        setSocials(socialsResultJson)
    }

    useEffect(() => {
        loadAbout()
    }, [])

    return (
        <div className="aboutSection" id="about">
            <img className="pfp" src={pfpUrl} alt="Profile picture" />
            <div className="textContainer">
                <h2>About <span className="highlighted">me</span></h2>
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {about}
                </ReactMarkdown>
                <div className="buttonContainer">
                    <p>Socials: </p>
                    {socials.map((social) => (
                        <a href={social.url} target="_blank">
                            <div className="socialsButton">
                                <img src={social.iconUrl} alt={social.iconUrl} />
                                {social.name}
                            </div>
                        </a>
                    ))}
                </div>
                <div className="buttonContainer">
                    <p>Contact me:</p>
                    <a href={"mailto:" + email} target="_blank">
                        <div className="socialsButton">
                            E-mail: {email}
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}