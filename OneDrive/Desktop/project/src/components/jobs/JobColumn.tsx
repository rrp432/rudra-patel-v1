import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Job, JobStatus } from "../../api/types";
import JobCard from "./JobCard";

interface JobColumnProps {
	status: JobStatus;
	jobs: Job[];
	onEditJob: (job: Job) => void;
}

// Column header styling based on status
const STATUS_STYLES = {
	SAVED: "text-gray-700 dark:text-gray-300",
	APPLIED: "text-blue-700 dark:text-blue-300",
	INTERVIEWING: "text-yellow-700 dark:text-yellow-300",
	OFFER: "text-green-700 dark:text-green-300",
	REJECTED: "text-red-700 dark:text-red-300",
};

const STATUS_LABELS = {
	SAVED: "Saved",
	APPLIED: "Applied",
	INTERVIEWING: "Interviewing",
	OFFER: "Offer",
	REJECTED: "Rejected",
};

const JobColumn: React.FC<JobColumnProps> = ({ status, jobs, onEditJob }) => {
	const { setNodeRef, isOver } = useDroppable({
		id: `column-${status}`,
		data: {
			type: "column",
			status,
		},
	});

	return (
		<div
			ref={setNodeRef}
			className={`
        flex flex-col h-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden
        ${isOver ? "ring-2 ring-primary-500 dark:ring-primary-400" : ""}
      `}
		>
			<div
				className={`p-3 border-b border-gray-200 dark:border-gray-700 font-medium ${STATUS_STYLES[status]}`}
			>
				<div className="flex justify-between items-center">
					<span>{STATUS_LABELS[status]}</span>
					<span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
						{jobs.length}
					</span>
				</div>
			</div>

			<div className="flex-1 p-2 overflow-y-auto">
				{jobs.map((job) => (
					<JobCard key={job.id} job={job} onEdit={onEditJob} />
				))}

				{jobs.length === 0 && (
					<div className="flex items-center justify-center h-full text-center p-4">
						<div className="text-gray-400 dark:text-gray-600">
							<p className="text-sm">Drop jobs here</p>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default JobColumn;
