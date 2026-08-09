import "./Dashboard.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavBar } from "../../components/navbar/navbar";
import { CollapseableCard } from "../../components/collapseableCard/collapseableCard";
import { DashboardProjectCard } from "../../components/dashboardProjectCard/dashboardProjectCard";
import { SocialEditorCard } from "../../components/socialEditorCard/socialEditorCard";
import { DashboardImageCard } from "../../components/dashboardImageCard/dashboardImageCard";
import { FileCard } from "../../components/fileCard/fileCard";
import { AboutEditor } from "../../components/aboutEditor/aboutEditor";
import { LoginPage } from "../Login/Login";
import { Footer } from "../../components/footer/footer";



export function Dashboard() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [projects, setProjects] = useState([])

    async function checkAuthState() {
        const result = await fetch("/api/validateSession")
        if (result.status == 200) {
            const jsonResponse = await result.json()
            if (jsonResponse.authorized) {
                setIsLoggedIn(true)
            } else {
                setIsLoggedIn(false)
            }
        } else {
            setIsLoggedIn(false)
        }
    }

    async function reloadProjects() {
        try {
            const response = await fetch("/api/getProjects");
            const jsonResponse = await response.json();
            setProjects(jsonResponse);
        } catch (error) {
            console.error(error);
        }
    }

    async function logout() {
        const result = await fetch("/api/logout")
        if (result.status == 200) {
            navigate("/")
        }
    }

    async function newProject() {
        const result = await fetch("/api/createProject", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: "New project",
                imageUrl: "placeholder.webp",
                shortDescription: "Description of a new project",
                github: "/",
                public: false
            })
        })
        if (result.status == 200) {
            reloadProjects()
        }
    }

    useEffect(() => {
        checkAuthState();
        reloadProjects();
    }, []);


    const [socials, setSocials] = useState([])

    async function reloadSocials() {
        try {
            const response = await fetch("/api/getSocials");
            const jsonResponse = await response.json();
            setSocials(jsonResponse);
        } catch (error) {
            console.error(error);
        }
    }

    async function addSocial() {
        const result = await fetch("/api/createSocial", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: "New social",
                iconUrl: "/placeholder.webp",
                url: "/"
            })
        })
        if (result.status == 200) {
            reloadSocials()
        }
    }

    useEffect(() => {
        reloadSocials();
    }, [])

    const [uploads, setUploads] = useState([])
    const [selectedFile, setSelectedFile] = useState(null);
    async function reloadUploads() {
        const result = await fetch("/api/getUploads")
        const jsonResult = await result.json()
        setUploads(jsonResult)
    }

    async function uploadFile(e) {
        e.preventDefault()
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }
        const formData = new FormData()
        formData.append("file", selectedFile)

        try {
            const result = await fetch("/api/upload", {
                method: "POST",
                body: formData
            })
            if (result.status == 200) {
                setSelectedFile(null)
                e.target.reset()
                reloadUploads()
            } else {
                alert("Failed to upload!")
                return
            }
        } catch {
            alert("Failed to upload!")
        }
    }

    useEffect(() => {
        reloadUploads()
    }, [])

    const [selectedImage, setSelectedImage] = useState(null)
    const [galleryImages, setGalleryImages] = useState([])


    async function uploadImage(e) {
        e.preventDefault()
        if (!selectedImage) {
            alert("Please select a file first.");
            return;
        }
        const formData = new FormData()
        formData.append("file", selectedImage)
        formData.append("description", "")
        formData.append("tags", JSON.stringify([]))
        formData.append("public", "false")

        try {
            const result = await fetch("/api/uploadImage", {
                method: "POST",
                body: formData
            })
            if (result.status == 200) {
                setSelectedFile(null)
                e.target.reset()
                reloadUploads()
            } else {
                alert("Failed to upload!")
                return
            }
        } catch {
            alert("Failed to upload!")
        }
        reloadGalleryImages()
    }

    async function reloadGalleryImages() {
        const result = await fetch("/api/getAllImages")
        const jsonResult = await result.json()
        setGalleryImages(jsonResult)
    }

    useEffect(() => {
        reloadGalleryImages()
    }, [])

    return (
        <main className="dashboard">
            <NavBar>
                {isLoggedIn && <button onClick={logout} className="logoutButton">Logout</button>}
            </NavBar>
            {(isLoggedIn == false) && <LoginPage onLoggedIn={checkAuthState} />}
            {isLoggedIn && <div className="dashboardContent">
                <CollapseableCard title="Projects">
                    <button onClick={newProject} style={{ width: "95%", marginTop: "10px" }}>Create new project</button>
                    {projects.map((project) => (<DashboardProjectCard key={project.id} project={project} deletionCallback={reloadProjects} />))}
                </CollapseableCard>
                <CollapseableCard title="Gallery">
                    <form onSubmit={uploadImage}>
                        <input type="file" name="file" onChange={(e) => setSelectedImage(e.target.files[0])} />
                        <input type="submit" value="Upload" />
                    </form>
                    {galleryImages.map((image) => (
                        <DashboardImageCard image={image} onDeletion={() => { reloadGalleryImages() }} />
                    ))}
                </CollapseableCard>
                <CollapseableCard title="Uploads">
                    <form onSubmit={uploadFile}>
                        <input type="file" name="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                        <input type="submit" value="Upload" />
                    </form>
                    {uploads.map((upload) => (<FileCard file={upload} deletionCallback={reloadUploads} />))}
                </CollapseableCard>
                <CollapseableCard title="About section">
                    <AboutEditor />
                    <CollapseableCard title="Socials">
                        <button onClick={addSocial} style={{ width: "95%", marginTop: "10px" }}>Add social platform link</button>
                        {socials.map((social) => (<SocialEditorCard social={social} deletionCallback={reloadSocials} />))}
                    </CollapseableCard>
                </CollapseableCard>
            </div>}
        </main>
    )
}