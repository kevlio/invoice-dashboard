import React from "react";
import "./HoverButton.scss";

import { CloseButton } from "@mantine/core";

type Props = {
  text: string;
  onClick: () => void;
  deleteProject: (id: string) => Promise<void>;
  projectId: string;
};

const HoverButton = (props: Props) => {
  return (
    <div className="box-hover">
      <div className="btn btn-hover" onClick={props.onClick}>
        <span>{props.text}</span>
      </div>
      <CloseButton
        miw="25%"
        variant="transparent"
        color="red"
        onClick={() => props.deleteProject(props.projectId)}
      />
    </div>
  );
};

export default HoverButton;
