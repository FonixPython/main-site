import "./Dashboard.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavBar } from "../components/navbar/navbar";
import { CollapseableCard } from "../components/collapseableCard/collapseableCard";
import { DashboardProjectCard } from "../components/dashboardProjectCard/dashboardProjectCard";




export function Dashboard() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([])

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
        reloadProjects();
    }, []);

    return (
        <main>
            <NavBar>
                <button onClick={logout}>Logout</button>
            </NavBar>
            <CollapseableCard title="Projects">
                <button onClick={newProject}>Create new project</button>
                {projects.map((project) => (<DashboardProjectCard key={project.id} project={project} />) )}
            </CollapseableCard>
        </main>
    )
}