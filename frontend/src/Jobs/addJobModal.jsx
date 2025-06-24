import React from 'react';
import '/css/jobsPage.css';
import '/css/ubuntu.css';

const JOB_SOURCES = [
    "LinkedIn",
    "Indeed",
    "Handshake",
    "CollegeGrad",
    "Idealist",
    "USAJobs",
    "Interstide",
    "GoinGlobal",
    "Internships.com",
    "College Recruiter",
    "AfterCollege",
    "Worldwide Job Boards",
    "GoAbroad",
    "WayUp",
    "DCInternships",
    "Google Jobs",
    "Networking",
    "Job Fair",
    "Other",
    "Company Website",
    "Referral"
]

const JOB_STATUSES = [
    { value: "applied", label: "Applied" },
    { value: "interview", label: "Interview" },
    { value: "offer", label: "Offer" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" }
]

export default function AddJobModal({
    showModal,
    setShowModal,
    formData,
    setFormData,
    formErrors,
    onSubmit,
    error
}) {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="ubuntu-medium">Add Job</h3>
                <form onSubmit={onSubmit}>
                    {/* Selecting Source Data */}
                    <select
                        value={formData.applied_from}
                        onChange={(e) => setFormData({ ...formData, applied_from: e.target.value })}
                        required
                    >
                        <option value="">Select Source</option>
                        {JOB_SOURCES.map((source) => (
                            <option key={source} value={source}>{source}</option>
                        ))}
                    </select>
                    {formErrors.applied_from && <span style={{color: "red"}}>{formErrors.applied_from}</span>}
                    <br /><br />

                    {/* Job Title */}
                    <input
                        type="text"
                        placeholder="Job Title"
                        value={formData.job_title}
                        onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                        required
                    />
                    {formErrors.job_title && <span style={{color: "red"}}>{formErrors.job_title}</span>}
                    <br /><br />

                    {/* Company Name */}
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={formData.company_name}
                        onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                        required
                    />
                    {formErrors.company_name && <span style={{color: "red"}}>{formErrors.company_name}</span>}
                    <br /><br />

                    {/* Location */}
                    <input
                        type="text"
                        placeholder="Location"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                    /> 
                    {formErrors.location && <span style={{color: "red"}}>{formErrors.location}</span>}
                    <br /><br />

                    {/* Application Date */}
                    <label>Date Applied:</label> <br />
                    <input
                        type="date"
                        value={formData.application_date}
                        onChange={(e) => setFormData({...formData, application_date: e.target.value})}
                    /> 
                    {formErrors.application_date && <span style={{color: "red"}}>{formErrors.application_date}</span>}
                    <br /><br />

                    {/* Status */}
                    <label>Status:</label> <br />
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                        required
                    >
                        <option value="">Select Status</option>
                        {JOB_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>{status.label}</option>
                        ))}
                    </select> 
                    {formErrors.status && <span style={{color: "red"}}>{formErrors.status}</span>}
                    <br /><br />

                    {/* Submit Button */}
                    <button type="submit" className="submit-button">Submit</button>
                    
                    {/* Cancel Button */}
                    <button type="button" onClick={() => setShowModal(prevState => ({...prevState, status: null}))} className="cancel-button">Cancel</button>
                    
                </form>
            </div>
        </div>
    );
}