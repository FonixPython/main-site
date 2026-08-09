import { useEffect, useState } from "react"
import { NavBar } from "../../components/navbar/navbar"
import { Footer } from "../../components/footer/footer"
import "./Gallery.css"

export function Gallery() {
    const [allImages, setAllImages] = useState([])
    const [filteredImages, setFilteredImages] = useState(allImages)
    const [allTags, setAllTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])

    async function reloadAllImages() {
        const result = await fetch("/api/getPublicImages")
        const jsonResult = await result.json()
        const images = [...jsonResult]
        images.map((image, i) => {
            images[i].tags = JSON.parse(image.tags)
        })
        setAllImages(jsonResult)
        setFilteredImages(jsonResult)
    }

    async function reloadAllTags() {
        const result = await fetch("/api/getTags")
        const jsonResult = await result.json()
        setAllTags(jsonResult)
    }

    useEffect(() => {
        reloadAllImages()
        reloadAllTags()
    }, [])

    async function handleFilterImages(tags) {
        console.log("a")
        let images = [...allImages]
        tags.map((tag) => {
            images = images.filter((image) => image.tags.includes(tag))
        })
        setFilteredImages(images)
    }

    return (
        <>
            <NavBar />
            <main className="gallery">
                <div className="sideBar">
                    <div className="tagFilter">
                        <p>Tag filter:</p>
                        <div className="selectedTags">
                            {selectedTags.map((tag, i) => (
                                <button className="removeTag" onClick={() => {
                                    setSelectedTags(prev => {
                                        const modifiedTags = [...prev]
                                        modifiedTags.splice(i, 1)
                                        handleFilterImages(modifiedTags)
                                        return modifiedTags
                                    });
                                }}>
                                    {tag}
                                </button>
                            ))}
                        </div>
                        {allTags.map((tag) => {
                            if (!selectedTags.includes(tag)) {
                                return (
                                    <button className="tag" onClick={() => { setSelectedTags(prev => { handleFilterImages([...prev, tag]); return ([...prev, tag]) }) }}>
                                        {tag}
                                    </button>
                                )
                            } else {
                                return null
                            }
                        })}
                    </div>
                </div>
                <div className="imagesContainer">
                    {filteredImages.map((image) => (
                        <div className="imageContainer">
                            <img draggable="false" src={"/api/uploads/" + image.lowresImageId} alt={image.description} />
                        </div>
                    ))}
                </div>
            </main>
            <Footer></Footer>
        </>
    )
}