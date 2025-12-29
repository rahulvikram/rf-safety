// API Client for communicating with the Python backend API

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export async function apiGet(endpoint: string, params?: Record<string, string>) {
    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    return response.json();
}

export async function apiPost(endpoint: string, data?: any) {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
    });
    return response.json();
}

export async function apiUploadFile(endpoint: string, file: File, fieldName: string = 'file') {
    const url = `${API_BASE_URL}${endpoint}`;
    const formData = new FormData();
    formData.append(fieldName, file);
    
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    return response.json();
}