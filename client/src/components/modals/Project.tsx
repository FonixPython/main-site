import { Children, useState } from "react"
import type { Project } from "../../pages/Dashboards/Dashboard"
import { ProjectCard } from "../projectCard/projectCard"

interface CreateProjectModalProps {
    reloadProjects: CallableFunction,
    setModalOpened: CallableFunction,
    setModal: CallableFunction
}

export function CreateProjectModal({ reloadProjects, setModal, setModalOpened }: CreateProjectModalProps) {
    async function createProject(e: React.SubmitEvent) {
        e.preventDefault()
        const data = new FormData(e.target)
        const result = await fetch("/api/createProject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: data.get("title"),
                imageUrl: data.get("imgUrl"),
                shortDescription: data.get("description"),
                github: data.get("github"),
                public: data.get("public") == "on"
            })
        })
        if (result.status == 200) {
            reloadProjects()
            setModalOpened(false)
            setModal({ title: "", children: <></> })
        }
    }

    const [image, setImage] = useState("placeholder.webp")

    return (
        <form action="" onSubmit={createProject}>
            <img src={(image != "") ? image : null} onError={(e) => { e.target.src = "placeholder.webp" }} alt="Preview" style={{ objectFit: "contain", width: "350px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                <p>Title: </p>
                <input type="text" name="title" placeholder="Title..." required />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                <p>Image URL: </p>
                <input type="text" name="imgUrl" value={image} onChange={(e) => { setImage(e.target.value) }} placeholder="Image url..." required />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                <p>Description: </p>
                <textarea name="description" placeholder="Description..." required />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                <p>Github Link: </p>
                <input type="text" name="github" placeholder="GitHub URL..." required />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                <p>Public: </p>
                <input type="checkbox" name="public" defaultChecked={false} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                <input type="submit" value="Create" style={{ width: "100%", margin: "3px" }} />
                <input type="button" style={{ width: "100%", margin: "3px" }} onClick={() => {
                    setModalOpened(false)
                    setModal({ title: "", children: <></> })
                }} value="Cancel" />
            </div>
        </form>
    )
}

interface EditProjectModalProps {
    reloadProjects: CallableFunction,
    setModalOpened: CallableFunction,
    setModal: CallableFunction,
    project: Project,
}

export function EditProjectModal({ reloadProjects, setModal, setModalOpened, project }: EditProjectModalProps) {
    const [projectState, setProjectState] = useState<Project>(project)
    async function deleteProject(e: React.MouseEvent) {
        e.preventDefault()
        const result = await fetch("/api/deleteProject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: projectState.id
            })
        })
        if (result.ok) {
            reloadProjects()
            setModalOpened(false)
            setModal({ title: "", children: <></> })
        }
    }

    async function editProject(e: React.SubmitEvent) {
        e.preventDefault()
        const result = await fetch("/api/editProject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectState)
        })
        if (result.ok) {
            reloadProjects()
            setModalOpened(false)
            setModal({ title: "", children: <></> })
        }
    }

    const handleChange = (e: React.ChangeEvent) => {
        const { name, value, type, checked } = e.target

        setProjectState(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }))
    }


    return (
        <div style={{ display: "flex" }}>
            <div className="editPanel">
                <form action="" onSubmit={editProject} style={{ width: "300px" }}>
                    <p>Title:</p>
                    <input type="text" placeholder="title" value={projectState.title} name="title" onChange={handleChange} style={{ width: "95%" }} />
                    <p>Image Url:</p>
                    <input type="text" placeholder="image url" value={projectState.imageUrl} name="imageUrl" onChange={handleChange} style={{ width: "95%" }} />
                    <p>Description:</p>
                    <textarea placeholder="description" value={projectState.shortDescription} name="shortDescription" onChange={handleChange} style={{ width: "95%" }} />
                    <p>Github Link:</p>
                    <input type="text" placeholder="github link" value={projectState.github} name="github" onChange={handleChange} style={{ width: "95%" }} />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "5px" }}>
                        <p>Public:</p>
                        <input type="checkbox" name="public" checked={projectState.public} onChange={handleChange} />
                    </div>
                    <div style={{ display: "flex" }}>
                        <input type="submit" value="Save" style={{ width: "100%", margin: "3px" }} />
                        <input type="button" style={{ width: "100%", margin: "3px" }} onClick={() => {
                            setModalOpened(false)
                            setModal({ title: "", children: <></> })
                        }} value="Cancel" />
                        <input type="button" value="Delete" style={{ width: "100%", margin: "3px" }} onClick={deleteProject} />
                    </div>
                </form>
            </div>
            <ProjectCard
                name={projectState.title}
                imageUrl={projectState.imageUrl || "/placeholder.webp"}
                description={projectState.shortDescription}
                github={projectState.github}
            />
        </div>
    )
}