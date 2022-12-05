import React from "react";
import { Task, ProjectTasks } from "../../interfaces";
import { Table } from "@mantine/core";

type Props = { tasks: Task[]; projectTasks: ProjectTasks[] };

const TaskTable = (props: Props) => {
  return (
    <Table
      highlightOnHover
      horizontalSpacing="md"
      verticalSpacing="xs"
      captionSide="top"
    >
      <caption>Amount of tasks: {props.tasks.length}</caption>
      <thead
        style={{
          top: "0",
          position: "sticky",
          zIndex: "2",
          backdropFilter: "blur(4px)",
        }}
      >
        <tr>
          <th>Task name</th>
          <th>Belongs to Project</th>
        </tr>
      </thead>
      <tbody>
        {props.projectTasks &&
          props.projectTasks.map((project) =>
            project.tasks.length ? (
              project.tasks.map((task) => (
                <tr key={project.id}>
                  <td>{task.name}</td>
                  <td>{project.name}</td>
                </tr>
              ))
            ) : (
              <></>
            )
          )}
      </tbody>
    </Table>
  );
};

export default TaskTable;
