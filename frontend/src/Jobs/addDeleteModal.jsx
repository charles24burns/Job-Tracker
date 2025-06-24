import React from 'react';

export default function AddDeleteModal({
    showModal,
    setShowModal,
    onDelete
}) {
    if (!showModal) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3 className="ubuntu-medium">Delete Job</h3>
                <p>Are you sure you want to delete this job?</p>
                <button
                    onClick={onDelete}
                    className="delete-button ubuntu-regular"
                >
                    Delete
                </button>
                <button
                    onClick={() => setShowModal(prevState => ({...prevState, status: null, jobId: null}))}
                    className="cancel-button ubuntu-regular"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
