import axios from 'axios';

// Get base URL from environment variables, or fallback to current hostname for dev
const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5001`;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
