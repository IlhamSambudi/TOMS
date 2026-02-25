import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => {
        // If the backend returns { success: true, data: ... }, return element.data
        if (response.data && response.data.success) {
            return response.data;
        }
        return response;
    },
    (error) => {
        // Redirect to login on 401 (expired / invalid token)
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;

