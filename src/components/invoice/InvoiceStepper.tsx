import React, { useState, useEffect } from "react";
import { Stepper } from "@mantine/core";

type Props = {
  selectedProject: string;
  selectedTasks: string[];
  invoiceSent: boolean;
  setInvoiceSent: React.Dispatch<React.SetStateAction<boolean>>;
};

const InvoiceStepper = (props: Props) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (props.selectedProject) setActive(1);
    if (props.selectedTasks.length) setActive(2);
    if (props.invoiceSent) setActive(3);

    setTimeout(() => {
      if (props.invoiceSent) {
        props.setInvoiceSent(false);
        setActive(0);
      }
    }, 1500);
  }, [props.selectedProject, props.selectedTasks, props.invoiceSent]);

  return (
    <Stepper active={active} onStepClick={setActive} breakpoint="sm">
      <Stepper.Step label="Project" description="Pick a Project"></Stepper.Step>
      <Stepper.Step
        label="Tasks, Timelogs"
        description="Select Tasks and Time"
      ></Stepper.Step>
      <Stepper.Step
        label="Invoice"
        description="Check and Send invoice"
      ></Stepper.Step>
    </Stepper>
  );
};

export default InvoiceStepper;
