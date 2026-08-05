import "./Dashboard.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavBar } from "../components/navbar/navbar";
import { CollapseableCard } from "../components/collapseableCard/collapseableCard";
import { DashboardProjectCard } from "../components/dashboardProjectCard/dashboardProjectCard";
import { LoginPage } from "./Login";




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
            console.error("Failed to load projects:", error);
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

    return (
        <main className="dashboard">
            <NavBar>
                {isLoggedIn && <button onClick={logout} className="logoutButton">Logout</button>}
            </NavBar>
            {(isLoggedIn == false) && <LoginPage onLoggedIn={checkAuthState} />}
            {isLoggedIn && <div className="dashboardContent">
                <CollapseableCard title="Projects">
                    <button onClick={newProject} style={{ width: "95%", marginTop:"10px"}}>Create new project</button>
                    {projects.map((project) => (<DashboardProjectCard key={project.id} project={project} deletionCallback={reloadProjects} />))}
                </CollapseableCard>
            </div>}
        </main>
    )
}