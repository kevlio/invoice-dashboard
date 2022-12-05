import { useState, useEffect, useContext, createContext } from "react";

import api from "../api/api";

import {
  GlobalInterface,
  Project,
  Task,
  Timelog,
  Invoice,
} from "../interfaces";

export const DashboardContext = createContext<GlobalInterface | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timelogs, setTimelogs] = useState<Timelog[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    getAllProjects();
    getAllTasks();
    getAllTimelogs();
    getAllInvoices();
  }, []);

  const getAllProjects = async () => {
    const fetchAllProjects = await api.projects.get();
    setProjects(fetchAllProjects);
  };

  const getAllTasks = async () => {
    const fetchAllTasks = await api.tasks.get();
    setTasks(fetchAllTasks);
  };

  const getAllTimelogs = async () => {
    const fetchAllTimelogs = await api.timelogs.get();
    setTimelogs(fetchAllTimelogs);
  };

  const getAllInvoices = async () => {
    const fetchAllTimelogs = await api.invoices.get();
    setInvoices(fetchAllTimelogs);
  };

  const providerValue = {
    projects,
    tasks,
    timelogs,
    invoices,
    getAllProjects,
    getAllTasks,
    getAllInvoices,
    getAllTimelogs,
  };

  return (
    <DashboardContext.Provider value={providerValue}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const contextValues = useContext(DashboardContext);

  if (!contextValues) {
    throw new Error("useDashboard is used outside its context");
  }

  return contextValues;
};
