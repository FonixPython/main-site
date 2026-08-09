import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Index } from './pages/Home/Home';
import { Dashboard } from './pages/Dashboards/Dashboard';
import { useEffect } from 'react';
export function App() {

    async function updateTitle() {
        const result = await fetch("/api/getAbout")
        const jsonResult = await result.json()
        if (jsonResult.title) {
            document.title = jsonResult.title || "Website"
        }
    }
    useEffect(() => {
        updateTitle()
    }, [])
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Index />} />
                <Route path='/dash' element={<Dashboard />} />
            </Routes>
        </Router>
    )
}