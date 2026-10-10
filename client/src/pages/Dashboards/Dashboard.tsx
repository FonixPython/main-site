import "./Dashboard.css"
import { useEffect, useState } from "react";
import { NavBar } from "../../components/navbar/navbar";
import { CollapseableCard } from "../../components/collapseableCard/collapseableCard";
import { DashboardProjectCard } from "../../components/dashboardProjectCard/dashboardProjectCard";
import { SocialEditorCard } from "../../components/socialEditorCard/socialEditorCard";
import { DashboardImageCard } from "../../components/dashboardImageCard/dashboardImageCard";
import { FileCard } from "../../components/fileCard/fileCard";
import { AboutEditor } from "../../components/aboutEditor/aboutEditor";
import { LoginPage } from "../Login/Login";
import { DashPage, SidebarDashboard } from "../../components/sidebarDashboard/sidebarDashboard";
import { Package, Image, Upload, CircleInfo } from "pixelarticons/react"
import { ModalWrapper } from "../../components/ModalWrapper/ModalWrapper";
import { CreateProjectModal } from "../../components/modals/Project";

export interface Project {
    id: string,
    title: string,
    imageUrl: string,
    shortDescription: string,
    github: string,
    public: boolean,
    dateOfCreation: string
}

export function Dashboard() {

    // Modal things

    interface ModalContent extends React.PropsWithChildren {
        title: string
    }

    const [modalOpened, setModalOpened] = useState(false)
    const [modalContent, setModalContent] = useState<ModalContent>({ title: "", children: <></> })


    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [projects, setProjects] = useState<Project[]>([])

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

    async function newProject() {
        setModalContent({
            title: "Add new project",
            children: <CreateProjectModal setModal={setModalContent} setModalOpened={setModalOpened} reloadProjects={reloadProjects} />
        })
        setModalOpened(true)
    }

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


    const [uploads, setUploads] = useState([])
    const [selectedFile, setSelectedFile] = useState(null);
    const [copiedTags, setCopiedTags] = useState([])

    async function reloadUploads() {
        const result = await fetch("/api/getUploads")
        const jsonResult = await result.json()
        setUploads(jsonResult)
    }

    async function uploadFile(e: React.SubmitEvent) {
        e.preventDefault()
        if (!selectedFile) {
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

    const [selectedImages, setSelectedImages] = useState([])
    const [galleryImages, setGalleryImages] = useState([])


    async function uploadImage(e: React.SubmitEvent) {
        e.preventDefault()
        if (!e.target) { return }
        if (selectedImages.length == 0) { return; }

        for (let i = 0; i < selectedImages.length; i++) {
            const formData = new FormData()
            formData.append("file", selectedImages[i])
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
                    reloadUploads()
                } else {
                    alert("Failed to upload!")
                }
            } catch (e) {
                console.log(e)
                alert("Failed to upload!")
            }
        }
        e.target.reset()
        alert("Uploaded successfully!")
        reloadGalleryImages()
    }

    async function reloadGalleryImages() {
        const result = await fetch("/api/getAllImages")
        const jsonResult = await result.json()
        setGalleryImages(jsonResult)
    }

    useEffect(() => {
        checkAuthState();
        reloadProjects();
        reloadSocials();
        reloadUploads()
        reloadGalleryImages()
    }, [isLoggedIn])

    return (
        <main className="dashboard">
            <ModalWrapper isopen={modalOpened} setOpen={setModalOpened} title={modalContent.title} children={modalContent.children} />
            <NavBar></NavBar>
            {(isLoggedIn == false) && <LoginPage onLoggedIn={checkAuthState} />}
            {isLoggedIn &&
                <SidebarDashboard>
                    <DashPage title="Projects" icon={<Package />}>
                        <button onClick={newProject} style={{ width: "100%", marginTop: "10px" }}>Create new project</button>
                        {projects.map((project) => (<DashboardProjectCard key={project.id} project={project} reloadProjects={reloadProjects} setModal={setModalContent} setModalOpened={setModalOpened} />))}
                    </DashPage>
                    <DashPage title="Gallery" icon={<Image />}>
                        <form onSubmit={uploadImage}>
                            <input type="file" name="file" onChange={(e) => setSelectedImages(e.target.files)} multiple />
                            <input type="submit" value="Upload" />
                        </form>
                        {galleryImages.map((image) => (
                            <DashboardImageCard image={image} onDeletion={() => { reloadGalleryImages() }} key={image.id} copyTags={setCopiedTags} copiedTags={copiedTags} />
                        ))}
                    </DashPage>
                    <DashPage title="Uploads" icon={<Upload />}>
                        <form onSubmit={uploadFile}>
                            <input type="file" name="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
                            <input type="submit" value="Upload" />
                        </form>
                        {uploads.map((upload) => (<FileCard file={upload} deletionCallback={reloadUploads} key={upload.id} />))}
                    </DashPage>
                    <DashPage title="About" icon={<CircleInfo />}>
                        <AboutEditor />
                        <CollapseableCard title="Socials">
                            <button onClick={addSocial} style={{ width: "95%", marginTop: "10px" }}>Add social platform link</button>
                            {socials.map((social) => (<SocialEditorCard social={social} deletionCallback={reloadSocials} key={social.id} />))}
                        </CollapseableCard>
                    </DashPage>
                </SidebarDashboard>}
        </main>
    )
}