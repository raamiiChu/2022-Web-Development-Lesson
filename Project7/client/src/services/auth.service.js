import axios from "axios";

const API_URL = "http://localhost:8080/api/user";

class AuthService {
    async login(email, password) {
        return await axios.post(`${API_URL}/login`, { email, password });
    }

    logout() {
        localStorage.removeItem("user");
    }

    async register(userName, email, password, role) {
        return await axios.post(`${API_URL}/register`, {
            userName,
            email,
            password,
            role,
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }
}

export default new AuthService();
