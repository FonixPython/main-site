import "./dashboardProjectCard.css"
import type { Project } from "../../pages/Dashboards/Dashboard"
import { EditProjectModal } from "../modals/Project"

interface DashboardProjectCardProps {
    project: Project,
    reloadProjects: CallableFunction,
    setModalOpened: CallableFunction,
    setModal: CallableFunction
}

export function DashboardProjectCard({ project, reloadProjects, setModalOpened, setModal }: DashboardProjectCardProps) {
    async function editModal() {
        setModal({
            title: "Edit project",
            children: <EditProjectModal project={project} reloadProjects={reloadProjects} setModal={setModal} setModalOpened={setModalOpened} />
        })
        setModalOpened(true)
    }

    return (
        <div className="dashboardProjectCard">
            <div className="viewMode">
                <img src={project.imageUrl || "/placeholder.webp"} alt={project.title} />
                <div>
                    <h2>{project.title}</h2>
                    <p>{project.shortDescription}</p>
                    <a target="_blank" href={project.github}>
                        <div className="button">
                            View on github
                        </div>
                    </a>
                    <button onClick={editModal}>Edit</button>
                </div>
            </div>
        </div>
    )
}