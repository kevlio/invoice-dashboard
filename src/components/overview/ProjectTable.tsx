import React from "react";
import { Project, Task, ProjectTasks } from "../../interfaces";
import { Table } from "@mantine/core";

type Props = {
  projects: Project[];
  tasks: Task[];
  projectTasks: ProjectTasks[];
  setProjectTasks: React.Dispatch<React.SetStateAction<ProjectTasks[]>>;
};

const ProjectTable = (props: Props) => {
  return (
    <Table
      highlightOnHover
      horizontalSpacing="md"
      verticalSpacing="xs"
      captionSide="top"
    >
      <caption>Amount of projects: {props.projects.length}</caption>
      <thead
        style={{
          top: "0",
          position: "sticky",
          zIndex: "2",
          backdropFilter: "blur(4px)",
        }}
      >
        <tr>
          <th>Project name</th>
          <th>Amount of Tasks</th>
        </tr>
      </thead>
      <tbody>
        {props.projectTasks &&
          props.projectTasks
            .sort((a, b) => b.taskCount - a.taskCount)
            .map((project) => (
              <tr key={project.id}>
                <td>{project.name}</td>
                <td>{project.taskCount}</td>
              </tr>
            ))}
      </tbody>
    </Table>
  );
};

export default ProjectTable;
