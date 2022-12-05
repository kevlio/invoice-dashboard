import React from "react";
import { Timelog } from "../../interfaces";
import { Table } from "@mantine/core";

type Props = {
  sumTimelogs: {
    sum: number;
    startDate: string;
    stopDate: string;
    timelogs: Timelog[];
  };
};

const TimelogTable = (props: Props) => {
  return (
    <Table
      highlightOnHover
      horizontalSpacing="md"
      verticalSpacing="xs"
      captionSide="top"
    >
      <caption>
        Last 30 days: {props.sumTimelogs.timelogs.length} sessions,{" "}
        {props.sumTimelogs.sum}h
      </caption>
      <thead
        style={{
          top: "0",
          position: "sticky",
          zIndex: "2",
          backdropFilter: "blur(4px)",
        }}
      >
        <tr>
          <th>Time active</th>
          <th>Start Date</th>
          <th>Stop Date</th>
        </tr>
      </thead>
      <tbody>
        {props.sumTimelogs.timelogs &&
          props.sumTimelogs.timelogs.map((timelog) => (
            <tr key={timelog.id}>
              <td>{timelog.duration}</td>
              <td>
                {timelog.startDate
                  .replace("T", " ")
                  .replace("Z", "")
                  .slice(0, 16)}
              </td>
              <td>
                {timelog.stopDate
                  .replace("T", " ")
                  .replace("Z", "")
                  .slice(0, 16)}
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default TimelogTable;
