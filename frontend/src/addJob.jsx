import React from "react";
import { useEffect , useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddJobPage() {
    const [appliedFrom, setAppliedFrom] = useState('');
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [dateApplied, setDateApplied] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    