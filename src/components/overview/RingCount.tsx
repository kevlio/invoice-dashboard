import React from "react";

import { Invoice, Timelog } from "../../interfaces";

import { Flex, Text, RingProgress } from "@mantine/core";

type Props = {
  setSelectedCategory: (value: React.SetStateAction<string>) => void;
  count: {
    projects: number;
    tasks: number;
    timelogs: number;
    invoices: number;
  };
  sumTimelogs: {
    sum: number;
    startDate: string;
    stopDate: string;
    timelogs: Timelog[];
  };
  sumInvoices: {
    sum: number;
    startDate: string;
    stopDate: string;
    invoices: Invoice[];
  };
};

const RingCount = (props: Props) => {
  return (
    <Flex align="center" direction="row" wrap="wrap" justify="center">
      <Flex>
        <RingProgress
          style={{ cursor: "pointer" }}
          onClick={() => props.setSelectedCategory("projects")}
          size={120}
          label={
            <Text color="blue" size="sm" weight={700} align="center">
              Projects: <br />
              {props.count.projects}
            </Text>
          }
          sections={[{ value: 100, color: "blue" }]}
        />
        <RingProgress
          style={{ cursor: "pointer" }}
          onClick={() => props.setSelectedCategory("tasks")}
          label={
            <Text color="grape" size="sm" weight={700}>
              Tasks: <br />
              {props.count.tasks}
            </Text>
          }
          sections={[{ value: 100, color: "grape" }]}
        />
      </Flex>
      <Flex>
        <RingProgress
          style={{ cursor: "pointer" }}
          onClick={() => props.setSelectedCategory("timelogs")}
          label={
            <Text color="blue" weight={700} align="center" size="sm">
              Logged {props.sumTimelogs.sum}h
            </Text>
          }
          sections={[
            {
              value: 100,
              color: "cyan",
              tooltip: `${props.sumTimelogs.startDate} - ${props.sumTimelogs.stopDate}`,
            },
          ]}
        />
        <RingProgress
          style={{ cursor: "pointer" }}
          onClick={() => props.setSelectedCategory("invoices")}
          label={
            <Text color="indigo" weight={700} align="center" size="sm">
              Invoiced {props.sumInvoices.sum.toLocaleString()}
            </Text>
          }
          sections={[
            {
              value: 100,
              color: "indigo",
              tooltip: `${props.sumInvoices.startDate} - ${props.sumInvoices.stopDate}`,
            },
          ]}
        />
      </Flex>
    </Flex>
  );
};

export default RingCount;
