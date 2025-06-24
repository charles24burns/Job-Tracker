import {state} from 'react';
import {useNavigate} from 'react-router-dom';

export function useDeleteJob(setJobs, job, setShowModal, setError) {
    const navigate = useNavigate();

    const jobId = job.id;

    const deleteJob = async (jobId) => {
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

        try {
            const response = await fetch(`http://localhost:5001/api/v1/jobs/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            
            if (!response.ok) {
                const data = await response.json();
                console.error("Error deleting job:", data);
                setError(data.message || "Failed to delete job");
                return;
            }

            // Remove the job from the state
            setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
            console.log("Job deleted successfully:", jobId);
            setShowModal(prevState => ({...prevState, status: null, jobId: null}));
        } catch (error) {
            console.error("Error during job deletion:", error);
            setError("An unexpected error occurred while deleting the job");
        }
    };

    return ( deleteJob );
}