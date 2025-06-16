// import e from "express";
// import { valid } from "joi";
import React, { use } from "react";
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!error)  return;
        const timer = setTimeout(() => setError(null), 5000);
        return () => clearTimeout(timer);
    }, [error]);

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        applied_from: '',
        job_title: '',
        company_name: '',
        location: '',
        application_date: '',
        status: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const validateFormData = () => {
        const errors = {};
        if (!formData.applied_from) {
            errors.applied_from = "Applied from is required";
        }
        if (!formData.job_title) {
            errors.job_title = "Job title is required";
        }
        if (!formData.company_name) {
            errors.company_name = "Company name is required";
        }
        if (!formData.location) {
            errors.location = "Location is required";
        } else if (!/^[\p{L}\s]+,\s*[\p{L}\s]+,\s[\p{L}\s]+$/u.test(formData.location)) {
            errors.location = "Location must be in the format 'City, State, Country'";
        }
        if (!formData.application_date) {
            errors.application_date = "Date applied is required";
        }
        if (!formData.status) {
            errors.status = "Status is required";
        }
        setFormErrors(errors);
        return errors;
    };
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
                onClick={() => setShowModal(true)}
                style={{
                    marginBottom: "1rem",
                    padding: "0.5rem 1rem",
                    fontSize: "1rem",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                }}
            >
                + Add Job
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
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white",
                        padding: "2rem",
                        borderRadius: "8px",
                        width: "400px"
                    }}>
                        <h3>Add Job</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();

                            const errors = validateFormData();
                            if (Object.keys(errors).length > 0) {
                                setFormErrors(errors);
                                console.error("Form validation errors:", errors);
                                return;
                            }

                            setFormErrors({});


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
                            console.log("Adding job for userId:", userId);
                            try {
                                const response = await fetch(`http://localhost:5001/api/v1/jobs/${userId}`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": `Bearer ${token}`,
                                    },
                                    body: JSON.stringify(formData),
                                });
                                const result = await response.json();
                                console.log("Response from adding job:", result);
                                
                                if (!response.ok || !result) {
                                    setError(result.message || "Failed to add job");
                                    return;
                                }
                                setJobs(prev => [...prev, result]);
                                console.log("Jobs:", jobs);
                                setShowModal(false);
                                setFormData({
                                    applied_from: '',
                                    job_title: '',
                                    company_name: '',
                                    location: '',
                                    application_date: '',
                                    status: ''
                                });
                            } catch (error) {
                                console.error("Error adding job:", error);
                                setError("An unexpected error occurred");
                            }
                        }}>
                            <select
                                value={formData.applied_from}
                                onChange={(e) => setFormData({...formData, applied_from: e.target.value})}
                                required
                            >
                                <option value="">Select Source</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Handshake">Handshake</option>
                                <option value="CollegeGrad">CollegeGrad</option>
                                <option value="Idealist">Idealist</option>
                                <option value="USAJobs">USAJobs</option>
                                <option value="Interstide">Interstide</option>
                                <option value="GoinGlobal">GoinGlobal</option>
                                <option value="Internships.com">Internships.com</option>
                                <option value="College Recruiter">College Recruiter</option>
                                <option value="AfterCollege">AfterCollege</option>
                                <option value="Worldwide Job Boards">Worldwide Job Boards</option>
                                <option value="GoAbroad">GoAbroad</option>
                                <option value="WayUp">WayUp</option>
                                <option value="DCInternships">DCInternships</option>
                                <option value="Google Jobs">Google Jobs</option>
                                <option value="Networking">Networking</option>
                                <option value="Job Fair">Job Fair</option>
                                <option value="Other">Other</option>
                                <option value="Company Website">Company Website</option>
                                <option value="Referral">Referral</option>
                            </select>
                            {formErrors.applied_from && (
                                <p style={{color: "red"}}>{formErrors.applied_from}</p>
                            )} <br /><br />
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={formData.job_title}
                                onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                                required
                            />
                            {formErrors.job_title && (
                                <p style={{color: "red"}}>{formErrors.job_title}</p>
                            )} <br /><br />
                            <input
                                type="text"
                                placeholder="Company Name"
                                value={formData.company_name}
                                onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                                required
                            />
                            {formErrors.company_name && (
                                <p style={{color: "red"}}>{formErrors.company_name}</p>
                            )} <br /><br />
                            <input
                                type="text"
                                placeholder="Location"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            /> 
                            {formErrors.location && (
                                <p style={{color: "red"}}>{formErrors.location}</p>
                            )} <br /><br />
                            <label>Date Applied:</label> <br />
                            <input
                                type="date"
                                value={formData.application_date}
                                onChange={(e) => setFormData({...formData, application_date: e.target.value})}
                            /> 
                            {formErrors.application_date && (
                                <p style={{color: "red"}}>{formErrors.application_date}</p>
                            )} <br /><br />
                            <label>Status:</label> <br />
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                required
                            >
                                <option value="">Select Status</option>
                                <option value="applied">Applied</option>
                                <option value="interviewing">Interviewing</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select> 
                            {formErrors.status && (
                                <p style={{color: "red"}}>{formErrors.status}</p>
                            )} <br /><br />
                            <p style={{color: "red"}}>{error}</p>
                            <br />
                            <button type="submit" 
                                style={{
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#4CAF50",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}>
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={{
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#f44336",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    marginLeft: "1rem"
                                }}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>                
                </div>
            )}
        </div>
    );
}