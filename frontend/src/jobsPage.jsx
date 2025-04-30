import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch('http://localhost:5001/api/v1/jobs', {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to fetch jobs");
                    return;
                }

                setJobs(data.jobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setError("An unexpected error occurred");
            }
        };
        fetchJobs();
    }, [navigate]);

    return (
        <div style={{padding: "2rem"}}>
            <h2>Jobs</h2>

            {error && <p style={{color: "red"}}>{error}</p>}

            {jobs.length === 0 ? (
                 <p>No jobs available</p>
            ) : (
            <ul>
                <p>Available jobs:</p>
                {jobs.map((job) => (
                    <li key={job._id}>
                        <h3>{job.title}</h3>
                        <p>{job.company_name} - {job.status}</p>
                    </li>
                ))}
            </ul>
            )}
        </div>
    );
}