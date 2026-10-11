import { useEffect, useState, useRef } from "react"
import type { DragEvent, ChangeEvent } from "react"
import { Plus } from "pixelarticons/react"
import "./Gallery.css"

interface UploadImageModalProps {
    reload: CallableFunction,
    setModal: CallableFunction,
    setModalOpened: CallableFunction
}

export function UploadImageModal({ reload, setModal, setModalOpened }: UploadImageModalProps) {
    const [image, setImage] = useState("placeholder.webp")
    const [imageId, setImageId] = useState(null)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    async function selectFiles(files: FileList | File[]) {
        const file = Array.from(files).find(file =>
            file.type.startsWith("image/")
        )
        if (!file) return
        const formData = new FormData()
        formData.append("file", file)
        formData.append("description", "")
        formData.append("tags", JSON.stringify([]))
        formData.append("public", "false")
        try {
            const result = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData
            })
            if (result.ok) {
                const jsonResult = await result.json()
                setImage(`/api/uploads/${jsonResult.lowresImageId}`)
                setImageId(jsonResult.id)
            } else {
                alert("Failed to upload!")
            }
        } catch (e) {
            console.log(e)
            alert("Failed to upload!")
        }
    }

    function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault()
        setIsDragging(false)
        selectFiles(e.dataTransfer.files)
    }

    function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            selectFiles(e.target.files)
        }
        e.target.value = ""
    }

    async function editImage(e: React.SubmitEvent) {
        e.preventDefault()
        const data = new FormData(e.target)
        const result = await fetch("/api/editImage", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id:imageId,
                description: data.get("description"),
                public: data.get("public") == "on",
                tags: imageTags
            })
        })
        if (result.ok) {
            reload()
            setModalOpened(false)
            setModal({ title: "", children: <></> })
        }
    }

    async function deleteImage() {
        const result = await fetch("/api/deleteImage", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: imageId })
        })
        if (result.ok) {
            reload()
            setModalOpened(false)
            setModal({ title: "", children: <></> })
        }
    }

    const [imageTags, setImageTags] = useState<string[]>([])
    const [allTags, setAllTags] = useState<string[]>([])

    async function getAllTags() {
        const result = await fetch("/api/getAllTags/")
        if (result.ok) {
            setAllTags(await result.json())
        }
    }

    const [currTagName, setCurrTagName] = useState("")

    async function addTag() {
        setImageTags([...imageTags, currTagName])
        setCurrTagName("")
    }

    useEffect(() => {
        getAllTags()
    }, [])

    return (
        <div className="imageUploadModal">
            <div className="settingsPanel">
                {imageId == null &&
                    <div className={`dropZone ${isDragging ? "dragging" : ""}`} onClick={() => fileInputRef.current?.click()} onDragEnter={(e) => {
                        e.preventDefault()
                        setIsDragging(true)
                    }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            e.dataTransfer.dropEffect = "copy"
                            setIsDragging(true)
                        }}
                        onDragLeave={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                                setIsDragging(false)
                            }
                        }}
                        onDrop={handleDrop}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                fileInputRef.current?.click()
                            }
                        }}
                    >
                        <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleFileInput} />
                        <p>Drop an image here</p>
                        <span>or click to browse</span>
                    </div>}
                {imageId != null &&
                    <form action="" onSubmit={editImage}>
                        <p>Description: </p>
                        <textarea name="description" placeholder="Description..." />
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <p>Public: </p>
                            <input type="checkbox" name="public" defaultChecked={false} />
                        </div>
                        <p>Tags:</p>
                        <div className="tagContainer">
                            {imageTags.map((tag, index) => (
                                <button className="imageTag" onClick={() => {
                                    const temp = [...imageTags];
                                    temp.splice(index, 1);
                                    setImageTags(temp)
                                }}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", margin: "5px" }}>
                            <input type="text" placeholder="Tag..." name="tag" value={currTagName} onChange={(e) => { setCurrTagName(e.target.value) }} />
                            <input type="button" className="addTagButton" onClick={addTag} value="+" style={{ fontSize: "1.1rem", textAlign: "center", padding: "5px", width: "40px", height: "40px" }} />
                        </div>
                        {(currTagName != "" && allTags.length > 0) &&
                            <div className="tagSuggestionContainer">
                                {allTags.filter(tag => (tag.toLowerCase().includes(currTagName.trim().toLocaleLowerCase()) && !imageTags.includes(tag))).sort().slice(0, 5).map((tag) => (
                                    <input type="button" onClick={() => {
                                        setCurrTagName("")
                                        setImageTags([...imageTags, tag])
                                    }} className="tagSuggestion" value={tag} />
                                ))}
                            </div>
                        }
                        <div style={{ display: "flex" }}>
                            <input type="submit" value="Save" style={{ width: "100%", margin: "3px" }} />
                            <input type="button" value="Cancel" style={{ width: "100%", margin: "3px" }} onClick={deleteImage} />
                        </div>
                    </form>
                }
            </div>
            <img src={image} alt="Uploaded image" className="previewImage" />
        </div>
    )
}