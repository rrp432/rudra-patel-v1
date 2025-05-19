import axios from "axios";
import API from "./axios";
import {
	AuthResponse,
	LoginCredentials,
	SignupCredentials,
	User,
} from "./types";

/**
 * Register a new user; returns the JWT token.
 */
export const signup = async (
	credentials: SignupCredentials
): Promise<string> => {
	try {
		const response = await API.post<AuthResponse>("/auth/signup", credentials);
		return response.data.token;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(error.response.data.message || "Signup failed");
		}
		throw new Error("Network error. Please try again.");
	}
};

/**
 * Log in an existing user; stores the JWT in localStorage and returns it.
 */
export const login = async (credentials: LoginCredentials): Promise<string> => {
	try {
		const response = await API.post<AuthResponse>("/auth/login", credentials);
		const token = response.data.token; // use `token`, not `accessToken`
		localStorage.setItem("token", token);
		return token;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			throw new Error(error.response.data.message || "Login failed");
		}
		throw new Error("Network error. Please try again.");
	}
};

/**
 * Log out the current user (clears token server-side if needed).
 */
export const logout = async (): Promise<void> => {
	localStorage.removeItem("token");
	await API.post("/auth/logout");
};

/**
 * Fetch the currently authenticated user's profile.
 */
export const getCurrentUser = async (): Promise<User | null> => {
	try {
		const { data } = await API.get<User>("/auth/me");
		return data;
	} catch {
		return null;
	}
};
