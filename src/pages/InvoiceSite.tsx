import React, { useState, useEffect } from "react";

import api from "../api/api";

import { useDashboard } from "../context/DashboardContext";
import { mergeTaskTimeLogs, totalInvoice } from "../utils";
import { Project, Invoice, ConcatTaskTimelogs } from "../interfaces";

import HoverButton from "../components/elements/HoverButton";
import InvoiceCard from "../components/invoice/InvoiceCard";
import InvoiceStepper from "../components/invoice/InvoiceStepper";
import ProjectModal from "../components/invoice/ProjectModal";
import Tasklogs from "../components/invoice/Tasklogs";

import dayjs from "dayjs";

import { Container, Flex, Grid, Modal, Text } from "@mantine/core";

const defaultInvoice = {
  id: "",
  customer: "",
  projectName: "",
  projectId: "",
  hourlyRate: 0,
  duration: "00:00",
  fee: 0,
  sentAt: "",
  dueDate: "",
};

const InvoiceSite = () => {
  const { projects, getAllProjects, getAllInvoices, tasks, timelogs } =
    useDashboard();

  const [projectsWTasks, setProjectsWTasks] = useState<Project[]>([]);
  const [taskTimeLogs, setTaskTimelogs] = useState<ConcatTaskTimelogs[]>([]);

  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");

  const [invoice, setInvoice] = useState<Invoice>(defaultInvoice);
  const [invoiceSent, setInvoiceSent] = useState(false);

  const [projectModal, setProjectModal] = useState(false);

  useEffect(() => {
    const projectsWithTasks = projects.filter((project) => {
      const availableTaskLogs = timelogs.map((task) => {
        return task.projectId;
      });

      if (availableTaskLogs.includes(project.id)) return project;
    });
    setProjectsWTasks(projectsWithTasks);
  }, [invoice, projects, tasks, timelogs]);

  const selectProject = async (
    projectId: string,
    projectName: string,
    customer: string,
    hourlyRate: number
  ) => {
    setSelectedTasks([]);
    const checkProject = await api.projects.get("id", projectId);
    if (!checkProject[0].hourlyRate || !checkProject[0].customer) {
      setProjectModal(true);
    }
    setInvoice((prevValues) => {
      return {
        ...prevValues,
        projectId: projectId,
        projectName: projectName,
        customer: customer,
        hourlyRate: hourlyRate,
        status: "unpaid",
        sentAt: dayjs().format("YYYY-MM-DD"),
        dueDate: dayjs().add(30, "day").format("YYYY-MM-DD"),
      };
    });
  };

  const getProjectsTasklogs = async (projectId: string) => {
    const fetchedTasks = await api.tasks.get();
    const fetchedTimelogs = await api.timelogs.get();

    const mergedtaskTimelogs = mergeTaskTimeLogs(
      projectId,
      fetchedTasks,
      fetchedTimelogs
    );
    setTaskTimelogs(mergedtaskTimelogs);
  };

  const selectedTasksFilter = (taskId: string) => {
    if (!selectedTasks.includes(taskId)) {
      setSelectedTasks((prevTasks) => {
        return [...prevTasks, taskId];
      });
    } else {
      setSelectedTasks(
        selectedTasks.filter((task) => {
          return task !== taskId;
        })
      );
    }
  };

  useEffect(() => {
    const filterSelectedTasks = taskTimeLogs.filter((task) => {
      if (selectedTasks.includes(task.id)) {
        return task;
      }
    });
    const invoiceDuration = totalInvoice(
      filterSelectedTasks,
      invoice.hourlyRate
    );

    setInvoice((prevValues) => {
      return {
        ...prevValues,
        duration: invoiceDuration?.duration
          ? invoiceDuration.duration
          : "00:00",
        fee: invoiceDuration?.totalFee ? invoiceDuration.totalFee : 0,
      };
    });
  }, [selectedTasks]);

  const deleteTimelog = async (id: string, projectId: string) => {
    await api.timelogs.delete(id);
    getProjectsTasklogs(projectId);
  };

  const deleteTask = async (id: string, projectId: string) => {
    await api.tasks.delete(id);
    getProjectsTasklogs(projectId);
  };

  const deleteProject = async (id: string) => {
    await api.projects.delete(id);
    await getAllProjects();
    getProjectsTasklogs(id);
    setInvoice(defaultInvoice);
  };

  const sendInvoice = async (invoice: Invoice) => {
    if (invoice.fee === 0 || invoice.duration === "00:00") return;

    await api.invoices.post(invoice);
    await getAllInvoices();
    setInvoiceSent(true);
    setInvoice(defaultInvoice);
    setSelectedProject("");
    setSelectedTasks([]);
    setTaskTimelogs([]);
  };

  return (
    <Container py="0">
      <h1>Invoice dashboard</h1>
      <Grid>
        <Grid.Col span={12}>
          <InvoiceStepper
            selectedProject={selectedProject}
            selectedTasks={selectedTasks}
            invoiceSent={invoiceSent}
            setInvoiceSent={setInvoiceSent}
          />
        </Grid.Col>
        <Grid.Col sm={4} md={4} lg={4}>
          <Flex
            direction="column"
            align="flex-start"
            justify="flex-start"
            wrap="wrap"
            gap="0.5rem"
          >
            <Text>Projects</Text>
            {projectsWTasks &&
              projectsWTasks.map((project: Project) => (
                <Flex direction="column">
                  <HoverButton
                    key={project.id}
                    projectId={project.id}
                    deleteProject={deleteProject}
                    text={project.name}
                    onClick={() => {
                      setInvoice(defaultInvoice);
                      setSelectedProject(project.id);
                      getProjectsTasklogs(project.id);
                      selectProject(
                        project.id,
                        project.name,
                        project.customer,
                        project.hourlyRate
                      );
                    }}
                  />
                  <Modal
                    opened={projectModal && selectedProject === project.id}
                    onClose={() => setProjectModal(false)}
                    title="Project information"
                  >
                    <ProjectModal
                      projectId={project.id}
                      setInvoice={setInvoice}
                      setProjectModal={setProjectModal}
                    />
                  </Modal>
                </Flex>
              ))}
          </Flex>
        </Grid.Col>
        <Grid.Col sm={4} md={4} lg={4}>
          <Tasklogs
            taskTimeLogs={taskTimeLogs}
            selectedTasks={selectedTasks}
            selectedTasksFilter={selectedTasksFilter}
            deleteTimelog={deleteTimelog}
            deleteTask={deleteTask}
          />
        </Grid.Col>
        <Grid.Col sm={4} md={4} lg={4}>
          {selectedProject ? (
            <InvoiceCard
              projectName={invoice.projectName}
              duration={invoice.duration}
              projectId={invoice.projectId}
              hourlyRate={invoice.hourlyRate}
              fee={invoice.fee}
              customer={invoice.customer}
              dueDate={invoice.dueDate}
              onClick={() => {
                sendInvoice(invoice);
              }}
            />
          ) : (
            <></>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default InvoiceSite;
