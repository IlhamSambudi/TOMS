import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
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
        const message = error.response?.data?.error || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default api;
