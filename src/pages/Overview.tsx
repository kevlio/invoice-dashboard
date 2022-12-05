import React, { useEffect, useState } from "react";

import { useDashboard } from "../context/DashboardContext";
import { Timelog, Invoice, ProjectTasks } from "../interfaces";
import { totalTimeBetween } from "../utils";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

import RingCount from "../components/overview/RingCount";
import InvoiceTable from "../components/overview/InvoiceTable";
import ProjectTable from "../components/overview/ProjectTable";
import TaskTable from "../components/overview/TaskTable";
import TimelogTable from "../components/overview/TimelogTable";
import TimeLineChart from "../components/charts/TimeLineChart";
import InvoiceBarChart from "../components/charts/InvoiceBarChart";

import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

import { Container, Flex } from "@mantine/core";
import ToggleViews from "../components/overview/ToggleViews";

const Overview = () => {
  const { projects, tasks, timelogs, invoices } = useDashboard();
  const [projectTasks, setProjectTasks] = useState<ProjectTasks[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("invoices");
  const [selectedViews, setSelectedViews] = useState<string[]>([]);

  const [count, setCount] = useState({
    projects: 0,
    tasks: 0,
    timelogs: 0,
    invoices: 0,
  });
  const [sumInvoices, setSumInvoices] = useState<{
    sum: number;
    startDate: string;
    stopDate: string;
    invoices: Invoice[];
  }>({
    sum: 0,
    invoices: [],
    startDate: "",
    stopDate: "",
  });

  const [sumTimelogs, setSumTimelogs] = useState<{
    sum: number;
    startDate: string;
    stopDate: string;
    timelogs: Timelog[];
  }>({
    sum: 0,
    timelogs: [],
    startDate: "",
    stopDate: "",
  });

  const [compactType, setcompactType] = useState<
    "horizontal" | "vertical" | null | undefined
  >("horizontal");

  useEffect(() => {
    countAmount();
    calculateInvoices();
    calculateTimelogs();
    concatProjectsTasks();
  }, [invoices, projects, tasks, timelogs]);

  const countAmount = () => {
    setCount({
      projects: projects.length,
      tasks: tasks.length,
      timelogs: timelogs.length,
      invoices: invoices.length,
    });
  };

  const concatProjectsTasks = () => {
    const projectWithTasks = projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) => project.id === task.projectId
      );
      return {
        ...project,
        tasks: projectTasks,
        taskCount: projectTasks.length,
      };
    });
    setProjectTasks(projectWithTasks);
  };

  const calculateTimelogs = () => {
    const startTimelogRange = dayjs().subtract(1, "month");
    const stopTimelogRange = dayjs();

    const timeLogsPastMonth = totalTimeBetween(
      timelogs,
      startTimelogRange,
      stopTimelogRange
    );
    setSumTimelogs(timeLogsPastMonth);
  };

  const calculateInvoices = () => {
    const startInvoiceRange = dayjs().subtract(1, "year");
    const stopInvoiceRange = dayjs();

    const invoicesPastYear = invoices.filter((invoice) => {
      if (
        dayjs(invoice.dueDate)
          .subtract(1, "month")
          .isBetween(startInvoiceRange, stopInvoiceRange, "day", "[]")
      ) {
        return invoice;
      }
    });

    const sumInvoices = invoicesPastYear.reduce((acc, el) => acc + el.fee, 0);

    setSumInvoices({
      invoices: invoicesPastYear,
      sum: sumInvoices,
      startDate: startInvoiceRange.format("YYYY-MM-DD"),
      stopDate: stopInvoiceRange.format("YYYY-MM-DD"),
    });
  };

  const getLayouts = () => {
    const savedLayouts = localStorage.getItem("grid-layout");
    return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout };
  };

  const handleLayoutChange = (layout: object, layouts: object) => {
    localStorage.setItem("grid-layout", JSON.stringify(layouts));
  };

  const layout = {
    lg: [
      { i: "tables", x: 0, y: 0, w: 3, h: 1 },
      { i: "barchart", x: 0, y: 0, w: 1, h: 1 },
      { i: "linechart", x: 0, y: 0, w: 1, h: 1 },
    ],
  };

  return (
    <Container miw="80vw" p={0}>
      <h1>Overview</h1>
      <Flex direction="column" align="center" pb="1rem">
        <RingCount
          count={count}
          setSelectedCategory={setSelectedCategory}
          sumTimelogs={sumTimelogs}
          sumInvoices={sumInvoices}
        />
        <ToggleViews
          selectedViews={selectedViews}
          setSelectedViews={setSelectedViews}
        />
      </Flex>
      <ResponsiveGridLayout
        className="layout"
        width={1200}
        rowHeight={300}
        layouts={getLayouts()}
        onLayoutChange={handleLayoutChange}
        compactType={compactType}
        preventCollision={!compactType}
        measureBeforeMount={true}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 3, md: 2, sm: 2, xs: 1, xxs: 1 }}
        isDraggable
        isResizable
        // isRearrangeable
      >
        <div
          key="tables"
          style={{
            overflowY: "scroll",
            display: `${selectedViews.includes("tables") ? "none" : "flex"}`,
          }}
        >
          {selectedCategory === "invoices" && (
            <InvoiceTable sumInvoices={sumInvoices} />
          )}
          {selectedCategory === "projects" && (
            <ProjectTable
              projects={projects}
              tasks={tasks}
              projectTasks={projectTasks}
              setProjectTasks={setProjectTasks}
            />
          )}

          {selectedCategory === "tasks" && (
            <TaskTable tasks={tasks} projectTasks={projectTasks} />
          )}
          {selectedCategory === "timelogs" && (
            <TimelogTable sumTimelogs={sumTimelogs} />
          )}
        </div>

        <div
          key="barchart"
          style={{
            display: `${selectedViews.includes("barchart") ? "none" : "flex"}`,
          }}
        >
          <InvoiceBarChart />
        </div>
        <div
          key="linechart"
          style={{
            display: `${selectedViews.includes("linechart") ? "none" : "flex"}`,
          }}
        >
          <TimeLineChart />
        </div>
      </ResponsiveGridLayout>
    </Container>
  );
};

export default Overview;
