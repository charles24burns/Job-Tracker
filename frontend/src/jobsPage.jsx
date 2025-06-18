
import React from "react";
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import AddJobModal from './Jobs/addJobModal.jsx';
import {useJobForm} from './Jobs/useJobForm.jsx';
import '/css/jobsPage.css';
import '/css/ubuntu.css';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!error)  return;
        const timer = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timer);
    }, [error]);

    const [showModal, setShowModal] = useState(null);
    const { formData, setFormData, formErrors, handleSubmit, resetForm } = useJobForm(setJobs, setError, setShowModal);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }
            if (!token) {
                navigate('/login');
                return;
            }
            console.log("Fetching jobs for userId:", userId);
            try {
                // Fetch jobs from the API
                const response = await fetch(`http://localhost:5001/api/v1/jobs/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Response from fetching jobs:", data);

                if (!response.ok) {
                    console.info("No jobs", data.message);
                    setJobs([]);
                    return;
                }

                setJobs(data || []);
            } catch (error) {
                console.error("Error fetching jobs:", error);
                setError("An unexpected error occurred - fecthing jobs");
            }
        };
        fetchJobs();
    }, [navigate]);

    return (
        <div style={{padding: "2rem"}}>
            <h2>Jobs</h2>

            <button
                onClick={() => {
                    console.log("Adding job");
                    console.log("Show modal:", showModal);
                    setShowModal("add");
                }}
                className = "addJob-button"
            >
                + Add Job
            </button>

            <button 
                onClick={() => setShowModal(true)}
                className = "addJob-button"
            >
                <span className="ubuntu-regular">Delete Job</span>
            </button>

            {error && <p style={{color: "red"}}>{error}</p>}

            {!jobs || jobs.length === 0 ? (
                 <p>No jobs available</p>
            ) : (
            <ul>
                <p>Available jobs:</p>
                {jobs.map((job) => (
                    <li key={job.id}>
                        <h3>{job.job_title}</h3>
                        <p>{job.company_name} - {job.status}</p>
                    </li>
                ))}
            </ul>
            )}
            <AddJobModal
                showModal={showModal === "add"}
                setShowModal={setShowModal}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                onSubmit={handleSubmit}
                error={error}
            />
            
        </div>
    );
}