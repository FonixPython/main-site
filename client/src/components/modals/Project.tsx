import { useState } from "react"

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