import React, { useState } from "react";
import api from "../../api/api";
import { Invoice } from "../../interfaces";

import { Flex, Button, TextInput } from "@mantine/core";

type Props = {
  projectId: string;
  setProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  setInvoice: (value: React.SetStateAction<Invoice>) => void;
};

const ProjectModal = (props: Props) => {
  const [hourlyRate, setHourlyRate] = useState<number>(0);
  const [customer, setCustomer] = useState<string>("");

  const updateHourlyRate = async (
    projectId: string,
    customer: string,
    hourlyRate: number
  ) => {
    const updateProject = await api.projects.get("id", projectId);
    const updatedProject = { ...updateProject[0], hourlyRate, customer };
    await api.projects.put(projectId, updatedProject);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateHourlyRate(props.projectId, customer, hourlyRate);
    props.setInvoice((prevValues) => {
      return {
        ...prevValues,
        customer: customer,
        hourlyRate: hourlyRate,
      };
    });
    props.setProjectModal(false);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Flex direction="column">
        <TextInput
          required
          type="text"
          placeholder="Customer"
          label="Customer"
          onChange={(e) => setCustomer(e.target.value)}
          rightSectionWidth={92}
        />
        <TextInput
          required
          type="number"
          placeholder="1000"
          label="Hourly rate"
          onChange={(e) => setHourlyRate(Number(e.target.value))}
          rightSectionWidth={92}
        />
        <Button type="submit" mt="1rem" style={{ alignSelf: "flex-end" }}>
          Submit
        </Button>
      </Flex>
    </form>
  );
};

export default ProjectModal;
