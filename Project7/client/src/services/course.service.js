import axios from "axios";

const API_URL = "http://localhost:8080/api/courses";

class CourseService {
    async post(title, description, price) {
        let token = "";
        if (localStorage.getItem("user")) {
            token = JSON.parse(localStorage.getItem("user")).token;
        }

        return await axios.post(
            API_URL,
            { title, description, price },
            {
                headers: { Authorization: token },
            }
        );
    }

    // get student's course
    async getEnrolledCourses(_id) {
        let token = "";
        if (localStorage.getItem("user")) {
            token = JSON.parse(localStorage.getItem("user")).token;
        }

        return await axios.get(`${API_URL}/student/${_id}`, {
            headers: { Authorization: token },
        });
    }

    async getCourseByName(name) {
        let token = "";
        if (localStorage.getItem("user")) {
            token = JSON.parse(localStorage.getItem("user")).token;
        }

        return await axios.get(`${API_URL}/findByName/${name}`, {
            headers: { Authorization: token },
        });
    }

    // find courses
    async get(_id) {
        let token = "";
        if (localStorage.getItem("user")) {
            token = JSON.parse(localStorage.getItem("user")).token;
        }

        return await axios.get(`${API_URL}/instructor/${_id}`, {
            headers: { Authorization: token },
        });
    }

    async enroll(_id, user_id) {
        let token = "";
        if (localStorage.getItem("user")) {
            token = JSON.parse(localStorage.getItem("user")).token;
        }

        return await axios.post(
            `${API_URL}/enroll/${_id}`,
            { user_id },
            {
                headers: { Authorization: token },
            }
        );
    }
}

export default new CourseService();
