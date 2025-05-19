// src/context/AuthContext.tsx

import React, {
	createContext,
	useContext,
	useEffect,
	useState,
	useRef,
} from "react";
import {
	getCurrentUser,
	login as apiLogin,
	logout as apiLogout,
	signup as apiSignup,
} from "../api/auth";
import { User, LoginCredentials, SignupCredentials } from "../api/types";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	error: string | null;
	login: (creds: LoginCredentials) => Promise<void>;
	signup: (creds: SignupCredentials) => Promise<void>;
	logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Ref to guard against double-init in React.StrictMode
	const didInit = useRef(false);

	useEffect(() => {
		if (didInit.current) return;
		didInit.current = true;

		const init = async () => {
			const token = localStorage.getItem("token");
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const me = await getCurrentUser();
				setUser(me);
			} catch {
				// invalid or expired token
				localStorage.removeItem("token");
			} finally {
				setLoading(false);
			}
		};

		init();
	}, []);

	const login = async (creds: LoginCredentials) => {
		setLoading(true);
		setError(null);
		try {
			const token = await apiLogin(creds);
			localStorage.setItem("token", token);

			const me = await getCurrentUser();
			setUser(me);
		} catch (err: any) {
			setError(err.message || "Login failed");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const signup = async (creds: SignupCredentials) => {
		setLoading(true);
		setError(null);
		try {
			const token = await apiSignup(creds);
			localStorage.setItem("token", token);

			const me = await getCurrentUser();
			setUser(me);
		} catch (err: any) {
			setError(err.message || "Signup failed");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		setLoading(true);
		try {
			await apiLogout();
			localStorage.removeItem("token");
			setUser(null);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, loading, error, login, signup, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
};
