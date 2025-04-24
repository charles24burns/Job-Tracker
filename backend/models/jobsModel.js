import db from '../db/index.js';

// console.log("✅ jobsModel.js loading db from:", db);

export const findAllJobsByUser = async (userId) => {
    try {
        const result = await db.query('SELECT * FROM job_applications WHERE user_id = $1 ORDER BY application_date DESC', [userId]);
        return result;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        throw error;
    }
};

export const findJob = async (jobId, userId) => {
    try {
        const result = await db.query('SELECT * FROM job_applications WHERE id = $1 AND user_id = $2', [jobId, userId]);
        return result;
    } catch (error) {
        console.error('Error fetching job:', error);
        throw error;
    }
};

export const createJob = async (jobData, userId) => {
    const { applied_from, job_title, company_name, application_date, location, status } = jobData;
    try {
        const result = await db.query(
            'INSERT INTO job_applications (user_id, applied_from, job_title, company_name, application_date, location, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userId, applied_from, job_title, company_name, application_date, location, status]
        );
        return result;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};

export const updateJob = async (jobId, userId, updateData) => {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);

    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(', ');
    const queryParams = [...values, jobId, userId];

    return db.query(
        `UPDATE job_applications SET ${setClause} WHERE id = $${values.length + 1} AND user_id = $${values.length + 2} RETURNING *`,
        queryParams
    );
};

export const deleteJob = async (jobId, userId) => {
    return db.query('DELETE FROM job_applications WHERE id = $1 AND user_id = $2 RETURNING *', [jobId, userId]);
};