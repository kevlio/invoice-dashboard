import React, { useState } from "react";

import { ConcatTaskTimelogs } from "../../interfaces";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

import { AiFillDownCircle, AiFillUpCircle } from "react-icons/ai";

import { Flex, Button, Text, CloseButton, Collapse } from "@mantine/core";

type Props = {
  taskTimeLogs: ConcatTaskTimelogs[];
  selectedTasks: String[];
  selectedTasksFilter: (taskId: string) => void;
  deleteTimelog: (id: string, projectId: string) => Promise<void>;
  deleteTask: (id: string, projectId: string) => Promise<void>;
};

const Tasklogs = (props: Props) => {
  const [logsOpened, setLogsOpened] = useState<{ open: boolean; id: string }>({
    open: false,
    id: "",
  });

  return (
    <Flex direction="column" align="flex-start" gap="0.5rem">
      <Text>Tasks</Text>
      <Flex
        draggable
        direction={{ base: "row", lg: "row" }}
        gap="1rem"
        align="flex-start"
        maw={{ sm: "200px" }}
        wrap="wrap"
      >
        {props.taskTimeLogs &&
          props.taskTimeLogs.map((tasklog) => (
            <Flex
              key={tasklog.id}
              direction="column"
              align="center"
              justify="space-between"
              mih="auto"
            >
              <Flex direction="column">
                <Flex
                  px="1rem"
                  justify="space-between"
                  align="center"
                  miw={{ base: "180px", md: "200px" }}
                  bg="#00000096"
                  style={{
                    flexGrow: "1",
                    borderRadius: "6px",
                    border: `
                    ${
                      props.selectedTasks.includes(tasklog.id)
                        ? "1px solid #12b886"
                        : "1px solid black"
                    }
                    `,
                  }}
                >
                  {!logsOpened.open || logsOpened.id !== tasklog.id ? (
                    <AiFillDownCircle
                      color="#12b886"
                      onClick={() =>
                        setLogsOpened({
                          open: true,
                          id: tasklog.id,
                        })
                      }
                    />
                  ) : (
                    <AiFillUpCircle
                      color="#12b886"
                      onClick={() =>
                        setLogsOpened({
                          open: false,
                          id: "",
                        })
                      }
                    />
                  )}

                  <Button
                    variant="subtle"
                    onClick={() => props.selectedTasksFilter(tasklog.id)}
                  >
                    {tasklog.name}
                    <Text fz="sm" pl="0.8rem" color="teal">
                      {tasklog.total.hours < 10
                        ? "0" + tasklog.total.hours
                        : tasklog.total.hours}
                      :{tasklog.total.minutes}
                    </Text>
                  </Button>
                  <CloseButton
                    variant="transparent"
                    color="red"
                    onClick={() =>
                      props.deleteTask(tasklog.id, tasklog.projectId)
                    }
                  />
                </Flex>
                <Flex direction="column" justify="center" align="center">
                  {tasklog.timelogs.map((log) => (
                    <Collapse
                      in={logsOpened.open && logsOpened.id === tasklog.id}
                    >
                      <Flex align="center" justify="center">
                        <Button
                          variant="subtle"
                          color="light"
                          rightIcon={
                            <CloseButton
                              color="red"
                              onClick={() =>
                                props.deleteTimelog(log.id, log.projectId)
                              }
                            />
                          }
                        >
                          {log.duration}
                        </Button>
                      </Flex>
                    </Collapse>
                  ))}
                  <Flex
                    direction="column"
                    align="flex-end"
                    justify="space-around"
                  ></Flex>
                </Flex>
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};

export default Tasklogs;
