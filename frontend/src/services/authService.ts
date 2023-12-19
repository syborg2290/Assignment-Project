import apiService from './apiService';

const loginUser = async (credentials: { email: string; password: string }) => {
    const response = await apiService.post('/login', credentials);
    if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
};

const registerUser = async (userData: { username: string; email: string; password: string }) => {
    const response = await apiService.post('/register', userData);
    if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
};

const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

const getUserProfile = async (id: string) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (!token) {
        throw new Error('No token found');
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    return apiService.get(`/profile?id=${id}`, { headers });
};

const authService = { registerUser, loginUser, logoutUser, getUserProfile };

export default authService;
