import React from "react";

import { Flex, Switch } from "@mantine/core";

type Props = {
  selectedViews: string[];
  setSelectedViews: React.Dispatch<React.SetStateAction<string[]>>;
};

const ToggleViews = (props: Props) => {
  const selectViews = (view: string) => {
    if (!props.selectedViews.includes(view)) {
      props.setSelectedViews((prevViews) => {
        return [...prevViews, view];
      });
    } else {
      props.setSelectedViews(
        props.selectedViews.filter((el) => {
          return el !== view;
        })
      );
    }
  };

  return (
    <Flex>
      <Switch
        label="Tables"
        size="md"
        onLabel="ON"
        offLabel="OFF"
        color="violet"
        checked={!props.selectedViews.includes("tables") ? true : false}
        onChange={() => selectViews("tables")}
      />
      <Switch
        label="Barchart"
        size="md"
        onLabel="ON"
        offLabel="OFF"
        color="violet"
        checked={!props.selectedViews.includes("barchart") ? true : false}
        onChange={() => selectViews("barchart")}
      />
      <Switch
        label="Linechart"
        size="md"
        onLabel="ON"
        offLabel="OFF"
        color="violet"
        checked={!props.selectedViews.includes("linechart") ? true : false}
        onChange={() => selectViews("linechart")}
      />
    </Flex>
  );
};

export default ToggleViews;
