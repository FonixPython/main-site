import "./dashboardProjectCard.css"
import { ProjectCard } from "../projectCard/projectCard"
import { useState } from "react"

export function DashboardProjectCard(props) {
    const [project, setProject] = useState(props.project)
    const [mode, setMode] = useState("view")

    async function saveChanges() {
        const result = await fetch("/api/editProject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project)
        })
        if (result.status == 200) {
            setMode("view")
        }
    }

    async function cancelChanges() {
        setProject(props.project)
        setMode("view")
    }

    async function deleteProject() {
        const result = await fetch("/api/deleteProject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: project.id
            })
        })
        if (props.deletionCallback) { props.deletionCallback() }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        setProject(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    return (
        <div className="dashboardProjectCard">
            <div className="editMode" style={{ display: (mode == "view") ? "none" : "flex" }}>
                <div className="editPanel">
                    <p>Title:</p>
                    <input type="text" placeholder="title" value={project.title} name="title" onChange={handleChange} />
                    <p>Image Url:</p>
                    <input type="text" placeholder="image url" value={project.imageUrl} name="imageUrl" onChange={handleChange} />
                    <p>Description:</p>
                    <input type="text" placeholder="description" value={project.shortDescription} name="shortDescription" onChange={handleChange} />
                    <p>Github Link:</p>
                    <input type="text" placeholder="github link" value={project.github} name="github" onChange={handleChange} />
                    <p>Public:</p>
                    <input type="checkbox" name="public" value={project.public} onChange={handleChange} />
                    <div style={{ display: "flex" }}>
                        <button onClick={cancelChanges}>Cancel</button>
                        <button onClick={saveChanges}>Save</button>
                        <button onClick={deleteProject}>Delete</button>
                    </div>
                </div>
                <ProjectCard
                    name={project.title}
                    imageUrl={project.imageUrl || "/placeholder.webp"}
                    description={project.shortDescription}
                    github={project.github}
                />
            </div>
            <div className="viewMode" style={{ display: (mode == "edit") ? "none" : "flex" }}>
                <img src={project.imageUrl || "/placeholder.webp"} alt={project.title} />
                <div>
                    <h2>{project.title}</h2>
                    <p>{project.shortDescription}</p>
                    <a target="_blank" href={project.github}>
                        <div className="button">
                            View on github
                        </div>
                    </a>
                    <button onClick={() => { setMode("edit") }}>Edit</button>
                </div>
            </div>
        </div>
    )
}