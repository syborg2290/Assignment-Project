const API_BASE_URL = 'http://127.0.0.1:5000/api';

const post = async (endpoint: string, data: any, options?: { headers?: HeadersInit }) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: options?.headers || { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return response.json();
};

const get = async (endpoint: string, options?: { headers?: HeadersInit }) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: options?.headers || {},
    });
    return response.json();
};

const apiService = { get, post };

export default apiService;
