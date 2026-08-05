import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Index } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
export function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Index />} />
                <Route path='/dash' element={<Dashboard />} />
            </Routes>
        </Router>
    )
}