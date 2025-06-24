import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useJobForm(setJobs, setError, setShowModal) {
    const [formData, setFormData] = useState({
        applied_from: '',
        job_title: '',
        company_name: '',
        location: '',
        application_date: '',
        status: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const validatedFormData = () => {
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

    const handleSubmit = async (e, jobs) => {
        e.preventDefault();
        const errors = validatedFormData();
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
            setShowModal(prevState => ({...prevState, status: null}));
            resetForm();
        } catch (error) {
            console.error("Error adding job:", error);
            setError("An unexpected error occurred");
        }
    }

    const resetForm = () => {
        setFormData({
            applied_from: '',
            job_title: '',
            company_name: '',
            location: '',
            application_date: '',
            status: ''
        });
        setFormErrors({});
    }

    return {
        formData,
        setFormData,
        formErrors,
        handleSubmit,
        resetForm
    }
}