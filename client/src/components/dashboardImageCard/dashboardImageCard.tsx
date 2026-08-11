import { useState } from "react"
import "./dashboardImageCard.css"

export function DashboardImageCard(props) {

    const [image, setImage] = useState({ ...props.image, tags: JSON.parse(props.image.tags) })
    const [tagInput, setTagInput] = useState("")
    const [tagInputVisible, setTagInputVisible] = useState(false)

    async function handleDeletion() {
        const result = await fetch("/api/deleteImage", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: image.id })
        })
        if (result.status == 200) {
            props.onDeletion()
        }
    }

    async function handleSave() {
        const result = await fetch("/api/editImage", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...image })
        })
    }

    return (
        <div className="dashboardImageCard">
            <img src={"/api/uploads/" + image.lowresImageId} alt="Lowres image thumbnail for gallery card" />
            <div className="editSection">
                <p>Description</p>
                <textarea name="" value={image.description} onChange={(e) => {
                    setImage(prev => ({ ...prev, description: e.target.value }))
                }}></textarea>
                <p>Tags:</p>
                <div className="tagsContainer">
                    {image.tags.map((tag, index) => (
                        <button className="tag" onClick={() => {
                            const updatedTags = [...image.tags]
                            updatedTags.splice(index, 1)
                            setImage(prev => ({ ...prev, ["tags"]: updatedTags }))
                        }}>{tag}</button>
                    ))}
                    {tagInputVisible && <input type="text" value={tagInput} onChange={(e) => { setTagInput(e.target.value) }} />}
                    <button className="tag" onClick={() => {
                        if (tagInputVisible) {
                            if (tagInput) {
                                const updatedTags = [...image.tags]
                                updatedTags.push(tagInput)
                                setTagInput("")
                                setImage(prev => ({ ...prev, ["tags"]: updatedTags }))
                            }
                            setTagInputVisible(false)
                        } else {
                            setTagInputVisible(true)
                        }
                    }}>{tagInputVisible ? "Add" : "+"}</button>
                    <button onClick={() => { props.copyTags(image.tags) }}>Copy all</button>
                    <button onClick={() => { setImage(prev => ({ ...prev, tags: [...image.tags, ...props.copiedTags] })) }}>Paste</button>
                </div>
                <div className="linearContainer">
                    <p>Public:</p>
                    <input type="checkbox" checked={image.public} onChange={(e) => {
                        setImage(prev => ({ ...prev, public: e.target.checked }))
                    }} />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => { setImage({ ...props.image, tags: JSON.parse(props.image.tags) }) }}>Cancel</button>
                    <button onClick={handleDeletion}>Delete</button>
                </div>
            </div>
        </div>
    )
}