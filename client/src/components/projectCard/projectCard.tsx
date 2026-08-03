import "./projectCard.css"

export function ProjectCard(props: any) {
    return (
        <div className="projectCard">
            <img src={props.imageUrl} alt="image of my project" />
            <div className="textContainer">
                <h3>{props.name}</h3>
                <p>{props.description}</p>
                <div>
                    <a target="_blank" href={props.github}>View on github</a>
                </div>
            </div>
        </div>
    )
}