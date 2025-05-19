import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './axios';
import {
  Job,
  Interview,
  Portal,
  MetricsResponse,
  Event,
  ResumeVersionsResponse,
} from './types';

// Mock data imports for fallback
import jobsMock from '../mocks/jobs.json';
import metricsMock from '../mocks/metrics.json';
import interviewsMock from '../mocks/interviews.json';
import portalsMock from '../mocks/portals.json';
import eventsMock from '../mocks/events.json';

// Query keys
const JOBS_KEY = 'jobs';
const INTERVIEWS_KEY = 'interviews';
const PORTALS_KEY = 'portals';
const METRICS_KEY = 'metrics';
const EVENTS_KEY = 'events';
const RESUME_VERSIONS_KEY = 'resumeVersions';

// ======= Jobs Queries =======
export const useJobs = () => {
  return useQuery<Job[]>({
    queryKey: [JOBS_KEY],
    queryFn: async () => {
      try {
        const { data } = await api.get<Job[]>('/jobs');
        return data;
      } catch (error) {
        console.error('Error fetching jobs, using mock data', error);
        return jobsMock as Job[];
      }
    },
  });
};

export const useCreateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newJob: Omit<Job, 'id'>) => {
      const { data } = await api.post<Job>('/jobs', newJob);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY] });
      queryClient.invalidateQueries({ queryKey: [METRICS_KEY] });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...job }: Job) => {
      const { data } = await api.put<Job>(`/jobs/${id}`, job);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY] });
      queryClient.invalidateQueries({ queryKey: [METRICS_KEY] });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/jobs/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOBS_KEY] });
      queryClient.invalidateQueries({ queryKey: [METRICS_KEY] });
    },
  });
};

// ======= Interviews Queries =======
export const useInterviews = () => {
  return useQuery<Interview[]>({
    queryKey: [INTERVIEWS_KEY],
    queryFn: async () => {
      try {
        const { data } = await api.get<Interview[]>('/interviews');
        return data;
      } catch (error) {
        console.error('Error fetching interviews, using mock data', error);
        return interviewsMock as Interview[];
      }
    },
  });
};

export const useCreateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newInterview: Omit<Interview, 'id'>) => {
      const { data } = await api.post<Interview>('/interviews', newInterview);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS_KEY] });
    },
  });
};

export const useUpdateInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...interview }: Interview) => {
      const { data } = await api.put<Interview>(`/interviews/${id}`, interview);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS_KEY] });
    },
  });
};

export const useDeleteInterview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/interviews/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTERVIEWS_KEY] });
    },
  });
};

// ======= Metrics Queries =======
export const useMetrics = (range: '7d' | '1m' | 'max' = '7d') => {
  return useQuery<MetricsResponse>({
    queryKey: [METRICS_KEY, range],
    queryFn: async () => {
      try {
        const { data } = await api.get<MetricsResponse>(`/metrics?range=${range}`);
        return data;
      } catch (error) {
        console.error('Error fetching metrics, using mock data', error);
        return metricsMock as MetricsResponse;
      }
    },
  });
};

// ======= Portals Queries =======
export const usePortals = () => {
  return useQuery<Portal[]>({
    queryKey: [PORTALS_KEY],
    queryFn: async () => {
      try {
        const { data } = await api.get<Portal[]>('/portals');
        return data;
      } catch (error) {
        console.error('Error fetching portals, using mock data', error);
        return portalsMock as Portal[];
      }
    },
  });
};

export const useCreatePortal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newPortal: Portal) => {
      const { data } = await api.post<Portal>('/portals', newPortal);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PORTALS_KEY] });
    },
  });
};

export const useDeletePortal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (domain: string) => {
      await api.delete(`/portals/${domain}`);
      return domain;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PORTALS_KEY] });
    },
  });
};

// ======= Events Queries =======
export const useEvents = () => {
  return useQuery<Event[]>({
    queryKey: [EVENTS_KEY],
    queryFn: async () => {
      try {
        const { data } = await api.get<Event[]>('/events');
        return data;
      } catch (error) {
        console.error('Error fetching events, using mock data', error);
        return eventsMock as Event[];
      }
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newEvent: Omit<Event, 'id'>) => {
      const { data } = await api.post<Event>('/events', newEvent);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...event }: Event) => {
      const { data } = await api.put<Event>(`/events/${id}`, event);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/events/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENTS_KEY] });
    },
  });
};

// ======= Resume Versions Queries =======
export const useResumeVersions = (jobId: string) => {
  return useQuery<ResumeVersionsResponse>({
    queryKey: [RESUME_VERSIONS_KEY, jobId],
    queryFn: async () => {
      const { data } = await api.get<ResumeVersionsResponse>(`/jobs/${jobId}/resumes`);
      return data;
    },
    enabled: !!jobId,
  });
};

export const useUploadResume = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post(`/jobs/${jobId}/resumes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RESUME_VERSIONS_KEY, jobId] });
    },
  });
};