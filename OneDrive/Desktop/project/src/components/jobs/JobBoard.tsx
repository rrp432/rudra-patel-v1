import React, { useState } from "react";
import {
	DndContext,
	DragOverlay,
	closestCorners,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { useJobs, useUpdateJob } from "../../api/queries";
import { Job, JobStatus } from "../../api/types";
import JobColumn from "./JobColumn";
import JobCard from "./JobCard";
import JobModal from "./JobModal";
import Button from "../shared/Button";

// Define job status columns
const JOB_STATUSES: JobStatus[] = [
	"SAVED",
	"APPLIED",
	"INTERVIEWING",
	"OFFER",
	"REJECTED",
];

const JobBoard: React.FC = () => {
	const { data: jobs = [], isLoading } = useJobs();
	const updateJobMutation = useUpdateJob();

	const [activeJob, setActiveJob] = useState<Job | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingJob, setEditingJob] = useState<Job | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const onDragStart = (event: any) => {
		const { active } = event;
		const draggedJob = jobs.find((job) => job.id === active.id);
		if (draggedJob) {
			setActiveJob(draggedJob);
		}
	};

	const onDragEnd = (event: any) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			// If dropping onto a column
			if (over.data?.current?.type === "column") {
				const newStatus = over.data.current.status as JobStatus;
				const jobToUpdate = jobs.find((job) => job.id === active.id);

				if (jobToUpdate && jobToUpdate.status !== newStatus) {
					// Update job status
					updateJobMutation.mutate({
						...jobToUpdate,
						status: newStatus,
						// If moving to APPLIED, set appliedAt to now
						appliedAt:
							newStatus === "APPLIED" && !jobToUpdate.appliedAt
								? new Date().toISOString()
								: jobToUpdate.appliedAt,
					});
				}
			}
		}

		setActiveJob(null);
	};

	const onDragCancel = () => {
		setActiveJob(null);
	};

	const handleEditJob = (job: Job) => {
		setEditingJob(job);
		setIsModalOpen(true);
	};

	const handleAddJob = () => {
		setEditingJob(null);
		setIsModalOpen(true);
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<>
			<div className="flex justify-end mb-4">
				<Button
					variant="primary"
					leftIcon={<Plus size={16} />}
					onClick={handleAddJob}
				>
					Add Job
				</Button>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCorners}
				onDragStart={onDragStart}
				onDragEnd={onDragEnd}
				onDragCancel={onDragCancel}
			>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 h-[600px] overflow-auto pb-4">
					{JOB_STATUSES.map((status) => {
						const statusJobs = jobs.filter((job) => job.status === status);

						return (
							<SortableContext
								key={status}
								items={statusJobs.map((job) => job.id)}
								strategy={rectSortingStrategy}
							>
								<JobColumn
									status={status}
									jobs={statusJobs}
									onEditJob={handleEditJob}
								/>
							</SortableContext>
						);
					})}
				</div>

				<DragOverlay>
					{activeJob ? <JobCard job={activeJob} /> : null}
				</DragOverlay>
			</DndContext>

			<JobModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				job={editingJob}
			/>
		</>
	);
};

export default JobBoard;
