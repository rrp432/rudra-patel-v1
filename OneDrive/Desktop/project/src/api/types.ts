// API types matching backend interfaces

export interface User {
	id: string;
	email: string;
	name: string;
	dailyTarget: number;
	currentStreak: number;
}

/**
 * Matches the JSON returned by your /auth/login and /auth/signup endpoints:
 *   { "token": "eyJhbGciOi..." }
 */
export interface AuthResponse {
	token: string;
}


export interface LoginCredentials {
	email: string;
	password: string;
}

export interface SignupCredentials {
	name: string;
	email: string;
	password: string;
}

export type JobStatus =
	| "SAVED"
	| "APPLIED"
	| "INTERVIEWING"
	| "OFFER"
	| "REJECTED";

export interface Job {
	id: string;
	title: string;
	company: string;
	location?: string;
	status: JobStatus;
	appliedAt?: string;
	resumeUrl?: string;
	tags?: string[];
	interviewStages?: string[];
}

export interface Interview {
	id: string;
	jobId: string;
	date: string; // ISO date string
	title: string;
}

export interface Portal {
	domain: string;
	customLogoUrl?: string;
}

export interface ResumeVersion {
	id: string;
	url: string;
	uploadedAt: string; // ISO date string
}

export interface ResumeVersionsResponse {
	versions: ResumeVersion[];
}

export interface StatusCount {
	status: string;
	count: number;
}

export interface DailyCount {
	date: string;
	count: number;
}

export interface MetricsResponse {
	statusCounts: StatusCount[];
	dailyCounts: DailyCount[];
}

export type EventType = "JOB_FAIR" | "MEETUP" | "WORKSHOP";

export interface Event {
	id: string;
	title: string;
	date: string; // ISO date string
	location: string;
	description?: string;
	type: EventType;
}

export interface UserSettings {
	darkMode: boolean;
	notifications: boolean;
	emailNotifications: boolean;
}
