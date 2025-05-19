import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
	useCreateJob,
	useUpdateJob,
	useDeleteJob,
	useResumeVersions,
	useUploadResume,
} from "../../api/queries";
import { Job, JobStatus, ResumeVersion } from "../../api/types";
import Modal from "../shared/Modal";
import Button from "../shared/Button";
import { format, parseISO } from "date-fns";
import { FileUp, Trash2, X } from "lucide-react";

interface JobModalProps {
	isOpen: boolean;
	onClose: () => void;
	job: Job | null;
}

// Default job object
const defaultJob: Omit<Job, "id"> = {
	title: "",
	company: "",
	location: "",
	status: "SAVED",
	tags: [],
};

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, job }) => {
	const [jobData, setJobData] = useState<Omit<Job, "id"> | Job>(defaultJob);
	const [newTag, setNewTag] = useState("");
	const [activeTab, setActiveTab] = useState<"details" | "resume">("details");

	const createJobMutation = useCreateJob();
	const updateJobMutation = useUpdateJob();
	const deleteJobMutation = useDeleteJob();

	// Resume versions queries (only if editing a job with id)
	const jobId = job?.id || "";
	const { data: resumeData, isLoading: resumeLoading } =
		useResumeVersions(jobId);
	const uploadResumeMutation = useUploadResume(jobId);

	// Reset form when modal opens/closes or job changes
	useEffect(() => {
		if (isOpen) {
			if (job) {
				setJobData(job);
				// If job has resume, default to resume tab
				if (job.resumeUrl) {
					setActiveTab("resume");
				} else {
					setActiveTab("details");
				}
			} else {
				setJobData(defaultJob);
				setActiveTab("details");
			}
			setNewTag("");
		}
	}, [isOpen, job]);

	const handleSubmit = () => {
		if (job && "id" in job) {
			// Update existing job
			updateJobMutation.mutate(jobData as Job);
		} else {
			// Create new job
			createJobMutation.mutate(jobData);
		}
		onClose();
	};

	const handleDelete = () => {
		if (job && "id" in job) {
			deleteJobMutation.mutate(job.id);
			onClose();
		}
	};

	const handleAddTag = () => {
		if (newTag.trim()) {
			setJobData({
				...jobData,
				tags: [...(jobData.tags || []), newTag.trim()],
			});
			setNewTag("");
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		setJobData({
			...jobData,
			tags: (jobData.tags || []).filter((tag) => tag !== tagToRemove),
		});
	};

	const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && job && "id" in job) {
			uploadResumeMutation.mutate(file);
		}
	};

	const resumeVersions = resumeData?.versions || [];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={job ? "Edit Job Application" : "Add Job Application"}
			size="lg"
			footer={
				<div className="flex justify-between">
					<div>
						{job && (
							<Button
								variant="danger"
								onClick={handleDelete}
								leftIcon={<Trash2 size={16} />}
							>
								Delete
							</Button>
						)}
					</div>
					<div className="flex space-x-2">
						<Button variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button
							variant="primary"
							onClick={handleSubmit}
							disabled={!jobData.title || !jobData.company}
						>
							{job ? "Update" : "Create"}
						</Button>
					</div>
				</div>
			}
		>
			{job && (
				<div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
					<button
						className={`px-4 py-2 font-medium text-sm ${
							activeTab === "details"
								? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400"
								: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						}`}
						onClick={() => setActiveTab("details")}
					>
						Details
					</button>
					<button
						className={`px-4 py-2 font-medium text-sm ${
							activeTab === "resume"
								? "text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400"
								: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
						}`}
						onClick={() => setActiveTab("resume")}
					>
						Resume Versions
					</button>
				</div>
			)}

			{activeTab === "details" ? (
				<div className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="title"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Job Title *
							</label>
							<input
								id="title"
								type="text"
								value={jobData.title}
								onChange={(e) =>
									setJobData({ ...jobData, title: e.target.value })
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
								placeholder="Frontend Developer"
								required
							/>
						</div>

						<div>
							<label
								htmlFor="company"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Company *
							</label>
							<input
								id="company"
								type="text"
								value={jobData.company}
								onChange={(e) =>
									setJobData({ ...jobData, company: e.target.value })
								}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
								placeholder="Acme Inc."
								required
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor="location"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Location
						</label>
						<input
							id="location"
							type="text"
							value={jobData.location || ""}
							onChange={(e) =>
								setJobData({ ...jobData, location: e.target.value })
							}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
							placeholder="San Francisco, CA (Remote)"
						/>
					</div>

					<div>
						<label
							htmlFor="status"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Status
						</label>
						<select
							id="status"
							value={jobData.status}
							onChange={(e) =>
								setJobData({ ...jobData, status: e.target.value as JobStatus })
							}
							className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
						>
							<option value="SAVED">Saved</option>
							<option value="APPLIED">Applied</option>
							<option value="INTERVIEWING">Interviewing</option>
							<option value="OFFER">Offer</option>
							<option value="REJECTED">Rejected</option>
						</select>
					</div>

					{jobData.status === "APPLIED" && (
						<div>
							<label
								htmlFor="appliedAt"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
							>
								Applied Date
							</label>
							<input
								id="appliedAt"
								type="date"
								value={
									jobData.appliedAt
										? format(parseISO(jobData.appliedAt), "yyyy-MM-dd")
										: ""
								}
								onChange={(e) => {
									if (e.target.value) {
										const date = new Date(e.target.value);
										setJobData({
											...jobData,
											appliedAt: date.toISOString(),
										});
									} else {
										setJobData({
											...jobData,
											appliedAt: new Date().toISOString(),
										});
									}
								}}
								className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
							/>
						</div>
					)}

					<div>
						<label
							htmlFor="tags"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						>
							Tags
						</label>
						<div className="flex">
							<input
								id="tags"
								type="text"
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
								placeholder="Add tag"
								onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
							/>
							<button
								onClick={handleAddTag}
								disabled={!newTag.trim()}
								className="rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
							>
								Add
							</button>
						</div>

						<div className="flex flex-wrap gap-2 mt-2">
							{(jobData.tags || []).map((tag, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									className="flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm dark:bg-gray-700 dark:text-gray-200"
								>
									{tag}
									<button
										onClick={() => handleRemoveTag(tag)}
										className="ml-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
									>
										<X size={14} />
									</button>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			) : (
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-medium text-gray-900 dark:text-white">
							Resume Versions
						</h3>

						<div className="relative">
							<input
								type="file"
								id="resume-upload"
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
								onChange={handleResumeUpload}
								accept=".pdf,.doc,.docx"
							/>
							<Button
								variant="outline"
								leftIcon={<FileUp size={16} />}
								className="relative"
							>
								Upload New Version
							</Button>
						</div>
					</div>

					{resumeLoading ? (
						<div className="flex items-center justify-center h-32">
							<div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
						</div>
					) : resumeVersions.length > 0 ? (
						<div className="space-y-2 max-h-[300px] overflow-y-auto">
							{resumeVersions.map((version: ResumeVersion) => (
								<a
									key={version.id}
									href={version.url}
									target="_blank"
									rel="noreferrer"
									className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
								>
									<div className="flex items-center">
										<div className="flex-shrink-0 mr-3">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-primary-500 dark:text-primary-400"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
												/>
											</svg>
										</div>
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												Resume Version{" "}
												{resumeVersions.length -
													resumeVersions.indexOf(version)}
											</div>
											<div className="text-xs text-gray-500 dark:text-gray-400">
												Uploaded{" "}
												{format(
													parseISO(version.uploadedAt),
													"MMM d, yyyy h:mm a"
												)}
											</div>
										</div>
									</div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-gray-400"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
										/>
									</svg>
								</a>
							))}
						</div>
					) : (
						<div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-md border border-dashed border-gray-300 dark:border-gray-700">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-10 w-10 text-gray-400 mx-auto mb-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
							<h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
								No resume versions yet
							</h4>
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
								Upload a resume for this job application
							</p>
						</div>
					)}
				</div>
			)}
		</Modal>
	);
};

export default JobModal;
