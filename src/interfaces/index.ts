export interface GlobalInterface {
  projects: Project[];
  tasks: Task[];
  timelogs: Timelog[];
  invoices: Invoice[];
  getAllProjects: () => Promise<void>;
  getAllTasks: () => Promise<void>;
  getAllTimelogs: () => Promise<void>;
  getAllInvoices: () => Promise<void>;
}

export interface User {
  id: string;
  username: string;
}

export type Invoice = {
  id: string;
  customer: string;
  projectName: string;
  projectId: string;
  status?: "paid" | "unpaid" | "delayed";
  hourlyRate: number;
  duration: string;
  fee: number;
  sentAt: string;
  dueDate: string;
};

export interface ProjectTasks extends Project {
  tasks: Task[];
  taskCount: number;
}

export interface TimelogMinutes extends Timelog {
  minutes: number;
}

export type ConcatTaskTimelogs = {
  id: string;
  name: string;
  user_id: string;
  projectId: string;
  // deadline: string;
  color: string;
  isDone: boolean;
  total: {
    hours: number;
    minutes: number;
  };
  timelogs: TimelogMinutes[];
};

export interface Project {
  id: string;
  name: string;
  user_id: string;
  color: string;
  deadline: string;
  description: string;
  isDone: boolean;
  customer: string;
  hourlyRate: number;
}

export interface Task {
  id: string;
  name: string;
  user_id: string;
  projectId: string;
  color: string;
  isDone: boolean;
}

export interface Timelog {
  id: string;
  taskId: string;
  projectId: string;
  user_id: string;
  duration: string;
  startDate: string;
  stopDate: string;
}
