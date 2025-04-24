CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE job_applications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    applied_from VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Applied',
    FOREIGN KEY (user_id) REFERENCES users(id)
);