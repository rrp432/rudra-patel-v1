import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { format, parseISO } from "date-fns";
import { MoreVertical, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Job } from "../../api/types";

interface JobCardProps {
	job: Job;
	onEdit?: (job: Job) => void;
	isOverlay?: boolean;
}

// Tag colors based on category
const TAG_COLORS: Record<string, string> = {
	// Languages
	JavaScript:
		"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
	TypeScript:
		"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
	Python:
		"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
	// Frameworks
	React: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
	Vue: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
	Angular: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
	// Default
	default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
};

const getTagColor = (tag: string): string => {
	return TAG_COLORS[tag] || TAG_COLORS.default;
};

const JobCard: React.FC<JobCardProps> = ({
	job,
	onEdit,
	isOverlay = false,
}) => {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: job.id,
			disabled: isOverlay,
		});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const formattedDate = job.appliedAt
		? format(parseISO(job.appliedAt), "MMM d, yyyy")
		: null;

	const handleEdit = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (onEdit) {
			onEdit(job);
		}
	};

	return (
		<motion.div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.02 }}
			className={`
        bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 
        shadow-sm cursor-grab active:cursor-grabbing mb-3 
        ${isOverlay ? "shadow-md" : ""}
      `}
		>
			<div className="flex justify-between items-start mb-2">
				<div>
					<h3 className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
						{job.title}
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
						{job.company}
					</p>
				</div>
				<button
					onClick={handleEdit}
					className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
				>
					<MoreVertical size={16} />
				</button>
			</div>

			{job.location && (
				<p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">
					{job.location}
				</p>
			)}

			<div className="flex flex-wrap gap-1 mb-2">
				{job.tags &&
					job.tags.map((tag, index) => (
						<span
							key={index}
							className={`px-2 py-0.5 rounded-full text-xs ${getTagColor(tag)}`}
						>
							{tag}
						</span>
					))}
			</div>

			<div className="flex justify-between items-center mt-2">
				<div className="flex items-center space-x-2">
					{job.resumeUrl && (
						<span className="text-primary-600 dark:text-primary-400">
							<FileText size={16} />
						</span>
					)}
					{/* Placeholder for ATS Score */}
					<span className="text-xs text-gray-500 dark:text-gray-400">
						ATS Score: --
					</span>
				</div>

				{formattedDate && (
					<span className="text-xs text-gray-500 dark:text-gray-400">
						{formattedDate}
					</span>
				)}
			</div>
		</motion.div>
	);
};

export default JobCard;
