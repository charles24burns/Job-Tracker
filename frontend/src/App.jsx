import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./loginPage";
import JobsPage from "./jobsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/jobs" element={<JobsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;