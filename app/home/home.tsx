import { NavBar } from "../components/navbar/navbar";
import { Hero } from "../components/hero/hero";
import { ProjectCard } from "../components/projectCard/projectCard";
import { About } from "~/components/about/about";
import { Footer } from "~/components/footer/footer";

export function Index() {
    return (
        <main>
            <NavBar></NavBar>
            <div id="home" style={{ height: "4rem" }}></div>
            <Hero></Hero>
            <div className="cardSection">
                <h2 id="projects">My <span className="highlighted">projects</span></h2>
                <div className="cardCarrier">
                    <ProjectCard imageUrl="matrix.png" name="LED Matrix" description="A controllable led matrix out of addressable LEDs." github="https://github.com/FonixPython/LEDMatrix"></ProjectCard>
                    <ProjectCard imageUrl="simpleShare.png" name="simpleShare" description="An open-source file sharing platform with easy to remember 6 character codes." github="https://github.com/FonixPython/LEDMatrix"></ProjectCard>
                    <ProjectCard imageUrl="inventoryManager.webp" name="Inventory Manager" description="Simple inventory manager that connects to a MySQL server." github="https://github.com/FonixPython/LEDMatrix"></ProjectCard>
                    <ProjectCard imageUrl="cigoriaDown.webp" name="cigoriaDown" description="A TUI built in python for downloading music with metadata from Youtube and Spotify!" github="https://github.com/FonixPython/LEDMatrix"></ProjectCard>
                </div>
            </div>
            <About></About>
            <Footer></Footer>
        </main>
    )
}