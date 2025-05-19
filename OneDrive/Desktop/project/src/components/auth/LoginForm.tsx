import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import Button from "../shared/Button";

const schema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof schema>;

const LoginForm: React.FC = () => {
	const { login, error } = useAuth();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginFormData>({ resolver: zodResolver(schema) });

	const onSubmit = async (data: LoginFormData) => {
		try {
			// pass credentials object, then navigate home
			await login({
				email: data.email,
				password: data.password,
			});
			navigate("/");
		} catch {
			// context.error will display the banner
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="max-w-md w-full mx-auto"
		>
			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
					Welcome back
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Log in to your JobVault account
				</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{error && (
					<div className="p-3 bg-error-50 text-error-700 rounded-md border border-error-200 dark:bg-error-900/20 dark:text-error-300 dark:border-error-800">
						{error}
					</div>
				)}

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						{...register("email")}
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
						placeholder="you@example.com"
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-error-600 dark:text-error-400">
							{errors.email.message}
						</p>
					)}
				</div>

				<div>
					<div className="flex items-center justify-between mb-1">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>
							Password
						</label>
						<Link
							to="#"
							className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
						>
							Forgot password?
						</Link>
					</div>
					<input
						id="password"
						type="password"
						{...register("password")}
						className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
						placeholder="••••••••"
					/>
					{errors.password && (
						<p className="mt-1 text-sm text-error-600 dark:text-error-400">
							{errors.password.message}
						</p>
					)}
				</div>

				<Button
					type="submit"
					variant="primary"
					fullWidth
					isLoading={isSubmitting}
				>
					Sign in
				</Button>
			</form>

			<p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
				Don't have an account?{" "}
				<Link
					to="/signup"
					className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
				>
					Sign up
				</Link>
			</p>
		</motion.div>
	);
};

export default LoginForm;
