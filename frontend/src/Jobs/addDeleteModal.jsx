import React from 'react';
import '/css/jobsPage.css';
import '/css/ubuntu.css';

export default function AddDeleteModal({
    showModal,
    setShowModal,
    onDelete,
    jobId
}) {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="ubuntu-medium">Delete Job</h3>
                <p>Are you sure you want to delete this job?</p>
                <form onSubmit={(e) => onDelete(e, jobId)}>
                <button
                    type = "submit"
                    className="submit-button ubuntu-regular"
                >
                    Delete
                </button>
                <button
                    onClick={() => setShowModal(prevState => ({...prevState, status: null, jobId: null}))}
                    className="cancel-button ubuntu-regular"
                >
                    Cancel
                </button>
                </form>
            </div>
        </div>
    );
}
