import api from './api.js';

const authService = {
    login: async (username, password) => {
        const res = await api.post('/auth/login', { username, password });
        // api interceptor already unwraps { success, data } → returns data
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getToken: () => localStorage.getItem('token'),

    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    },

    isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;
