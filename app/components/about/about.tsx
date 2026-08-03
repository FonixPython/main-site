import "./about.css"

export function About() {
    return (
        <div className="aboutSection" id="about">
            <img className="pfp" src="pfp.png" alt="Profile picture" />
            <div className="textContainer">
                <h2>About <span className="highlighted">me</span></h2>
                <p>Hello, I’m a 15 year old software developer based in hungary!</p>
                <p>Most of my development experience is in <span className="highlighted">backend development</span>  with both <span style={{ color: "#3771a2" }}>Python</span> and <span style={{ color: "#f7df1e" }}>Javascript</span>.</p>
                <div className="buttonContainer">
                    <p>Socials: </p>
                    <a href="https://github.com/FonixPython">
                        <div className="socialsButton">
                            <img src="github.png" alt="Logo of github" />
                            GitHub
                        </div>
                    </a>
                    <a href="https://www.youtube.com/@skyfonix1">
                        <div className="socialsButton">
                            <img src="unsplash.png" alt="Logo of unsplash" />
                            Unsplash
                        </div>
                    </a>
                    <a href="https://www.youtube.com/@skyfonix1">
                        <div className="socialsButton">
                            <img src="youtube.png" alt="Logo of youtube" />
                            YouTube channel
                        </div>
                    </a>
                </div>
                <div className="buttonContainer">
                    <p>Contact me:</p>
                    <a href="mailto:skyfonix@cigoria.eu">
                        <div className="socialsButton">
                            E-mail: skyfonix@cigoria.eu
                        </div>
                    </a>
                </div>
            </div>
        </div>
    )
}