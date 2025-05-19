// src/api/axios.ts
import axios from "axios";

const API = axios.create({
	baseURL: "http://localhost:8080/api", // direct to Spring Boot
});

API.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token && config.headers) {
		config.headers["Authorization"] = `Bearer ${token}`;
	}
	return config;
});

export default API;
