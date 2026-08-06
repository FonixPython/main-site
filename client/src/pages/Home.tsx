import { NavBar } from "../components/navbar/navbar";
import { Hero } from "../components/hero/hero";
import { ProjectCard } from "../components/projectCard/projectCard";
import { About } from "../components/about/about";
import { Footer } from "../components/footer/footer";
import { useState, useEffect } from "react";


export function Index() {
    const [publicProjects, setPublicProjects] = useState([])

    async function loadPublicProjects() {
        const result = await fetch("/api/getPublicProjects")
        if (result.status == 200) {
            setPublicProjects(await result.json())
        }
    }

    useEffect(() => {
        loadPublicProjects()
    }, [])

    return (
        <main>
            <NavBar id="home">
                <a href="#home">Home</a>
                <a href="#projects">Projects</a>
                <a href="#about">About</a>
            </NavBar>
            <Hero></Hero>
            <div className="cardSection">
                <h2 id="projects">My <span className="highlighted">projects</span></h2>
                <div className="cardCarrier">
                    {publicProjects.map((project) => (<ProjectCard imageUrl={project.imageUrl} name={project.title} description={project.shortDescription} github={project.github} />))}
                </div>
            </div>
            <About></About>
            <Footer></Footer>
        </main>
    )
}