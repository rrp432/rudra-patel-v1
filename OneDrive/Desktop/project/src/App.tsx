import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import MainLayout from "./components/layout/MainLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Interviews from "./pages/Interviews";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// Create a query client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000, // 5 minutes
		},
	},
});

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider>
				<AuthProvider>
					<Routes>
						{/* Public routes */}
						<Route path="/login" element={<Login />} />
						<Route path="/signup" element={<Signup />} />

						{/* Protected routes under MainLayout */}
						<Route path="/" element={<MainLayout />}>
							<Route index element={<Dashboard />} />
							<Route path="jobs" element={<Jobs />} />
							<Route path="interviews" element={<Interviews />} />
							<Route path="profile" element={<Profile />} />
							<Route path="settings" element={<Settings />} />
							<Route path="*" element={<Navigate to="/" replace />} />
						</Route>
					</Routes>
				</AuthProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
