import React from "react";
import {
  Card,
  Text,
  Button,
  Flex,
  Table,
} from "@mantine/core";

type Props = {
  projectName: string;
  customer: string;
  projectId: string;
  hourlyRate: number;
  duration: string;
  fee: number;
  dueDate: string;
  onClick: () => void;
};

const InvoiceCard = (props: Props) => {
  return (
    <Card maw="300px" bg="white" shadow="sm" p="sm" radius="sm" withBorder>
      <Flex direction="column" align="flex-start">
        <Text weight={500}>{props.projectName}</Text>
        <Text size="sm">Customer: {props.customer}</Text>
        <Text size="sm">
          Reference: {props.projectId.substring(props.projectId.length - 12)}
        </Text>
        <Text size="sm">Due date: {props.dueDate}</Text>
      </Flex>
      <Table horizontalSpacing="xs" verticalSpacing="xs">
        <thead>
          <tr>
            <th>Rate/h</th>
            <th>Time</th>
            <th>Fee</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.hourlyRate}</td>
            <td>{props.duration}</td>
            <td>{Number(props.fee).toLocaleString()}</td>
          </tr>
        </tbody>
      </Table>
      <Button
        variant="filled"
        color="dark"
        fullWidth
        mt="md"
        radius="md"
        onClick={props.onClick}
      >
        Send invoice
      </Button>
    </Card>
  );
};

export default InvoiceCard;
