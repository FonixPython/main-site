import { useEffect, useState } from "react"
import { NavBar } from "../../components/navbar/navbar"
import { Footer } from "../../components/footer/footer"
import "./Gallery.css"

export function Gallery() {
    const [allImages, setAllImages] = useState([])
    const [filteredImages, setFilteredImages] = useState(allImages)
    const [allTags, setAllTags] = useState([])
    const [selectedTags, setSelectedTags] = useState([])
    const [columns, setColumns] = useState(1)
    const [viewIndex, setViewIndex] = useState(0)
    const [viewerOpened, setViewerOpened] = useState(false)
    const COLUMN_WIDTH = 340
    const handleResize = () => {
        const currWidth = window.innerWidth - 400
        const newColumns = Math.floor(currWidth / COLUMN_WIDTH)
        if (newColumns != columns) {
            setColumns(Math.max(newColumns, 1))
        }
        return newColumns
    }
    useEffect(() => {
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    })

    async function reloadAllImages() {
        const result = await fetch("/api/getPublicImages")
        const jsonResult = await result.json()
        const images = [...jsonResult]
        images.map((image, i) => {
            images[i].tags = JSON.parse(image.tags)
            images[i].exifData = JSON.parse(image.exifData)
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
        handleResize()
    }, [])

    async function handleFilterImages(tags) {
        let images = [...allImages]
        tags.map((tag) => {
            images = images.filter((image) => image.tags.includes(tag))
        })
        setColumns(Math.max(Math.min(handleResize(), images.length), 1))

        setFilteredImages(images)
    }

    async function handleImageClick(index) {
        setViewIndex(index)
        await fetch("/api/registerClick", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: filteredImages[index].id })
        })
        setViewerOpened(true)
    }

    function makeColumns() {
        const cols = []
        const maxColumnLength = Math.ceil(filteredImages.length / columns)
        for (let i = 0; i < columns; i++) {
            const col = []
            for (let ix = 0; ix < maxColumnLength; ix++) {
                const imageIndex = (ix * columns) + i
                if (imageIndex < filteredImages.length) {
                    col.push(imageIndex)
                }
            }
            cols.push(col)
        }
        return cols
    }

    async function onDownload() {
        const link = document.createElement("a");
        link.href = "/api/downloadImage/" + filteredImages[viewIndex].id;
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                <div className="contentContainer">
                    <div className="columns">
                        {makeColumns().map((column) => (
                            <div className="imagesColumn">
                                {column.map((image) => (
                                    <div className="imageContainer" onClick={() => { handleImageClick(image) }}>
                                        <img draggable="false" src={"/api/uploads/" + filteredImages[image].lowresImageId} alt={filteredImages[image].description} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            {viewerOpened && <div className="screenCover">
                <div className="viewer">
                    <div className="topBar">
                        <div>
                            <p>{filteredImages[viewIndex].clicks} Views</p>
                            <p>{filteredImages[viewIndex].downloads} Downloads</p>
                        </div>
                        <button className="closeButton" onClick={() => { setViewerOpened(false) }}>X</button>
                    </div>
                    <div className="content">
                        <img draggable="false" src={"/api/uploads/" + filteredImages[viewIndex].imageId} />
                        <button onClick={onDownload}>Download</button>
                        <div className="informationContainer">
                            <div className="infoContainerSection">
                                <p className="sectionTitle">Tags</p>
                                <hr />
                                <div className="tagsContainer">
                                    {filteredImages[viewIndex].tags.map((tag) => (
                                        <div className="tag">
                                            <p>{tag}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="infoContainerSection">
                                <p className="sectionTitle">Camera Info</p>
                                <hr />
                                <p>Camera: {filteredImages[viewIndex].exifData.camera}</p>
                                <p>Lens: {filteredImages[viewIndex].exifData.lens}</p>
                                <p>Shutter speed: {filteredImages[viewIndex].exifData.shutterSpeed}</p>
                                <p>Aperture: F{filteredImages[viewIndex].exifData.aperture}</p>
                                <p>ISO: {filteredImages[viewIndex].exifData.iso}</p>
                                <hr />
                                <p>Taken on: {filteredImages[viewIndex].dateOfCreation}</p>
                            </div>
                            <div className="infoContainerSection">
                                <p className="sectionTitle">Description</p>
                                <hr />
                                <p>{filteredImages[viewIndex].description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
            <Footer></Footer>
        </>
    )
}