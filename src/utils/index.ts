import {
  Task,
  Timelog,
  ConcatTaskTimelogs,
  TimelogMinutes,
} from "../interfaces";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export function totalInvoice(
  selectedTasks: ConcatTaskTimelogs[],
  hourlyRate: number
) {
  if (!selectedTasks.length) return;

  const hoursInMinutes = selectedTasks.reduce(
    (acc, el) => acc + el.total.hours * 60,
    0
  );
  const totalMinutes = selectedTasks.reduce(
    (acc, el) => acc + el.total.minutes,
    0
  );
  const sumMinutes = hoursInMinutes + totalMinutes;
  const hours = Math.floor(sumMinutes / 60);
  const minutes = sumMinutes % 60;
  const totalFee = hours * hourlyRate + (minutes / 60) * hourlyRate;

  const formattedDuration = formatDuration(hours, minutes);

  return {
    duration: formattedDuration,
    totalFee,
  };
}

const formatDuration = (hours: number, minutes: number) => {
  let hourString = "";
  let minuteString = "";

  if (hours < 10) hourString = `0${hours}:`;
  else if (hours >= 10) hourString = `${hours}:`;

  if (minutes < 10) minuteString = `0${minutes}`;
  else if (minutes >= 10) minuteString = `${minutes}`;

  return hourString + minuteString;
};

export function totalTimeBetween(
  timelogs: Timelog[],
  startDate: dayjs.Dayjs,
  stopDate: dayjs.Dayjs
) {
  const timelogsByRange = timelogs.filter((timelog) => {
    if (dayjs(timelog.stopDate).isBetween(startDate, stopDate, "day", "[]")) {
      return timelog;
    }
  });
  const sumTimelogsByRange = timelogsByRange
    .map((timelog) => {
      const duration = timelog.duration.split(":");

      const totalMinutes =
        Number(duration[0]) * 60 +
        Number(duration[1]) +
        Number(duration[2]) / 60;

      return {
        ...timelog,
        minutes: totalMinutes,
      };
    })
    .reduce((acc, log) => acc + log.minutes, 0);

  const hours = Math.floor(sumTimelogsByRange / 60);

  return {
    sum: hours,
    timelogs: timelogsByRange,
    startDate: startDate.format("YYYY-MM-DD"),
    stopDate: stopDate.format("YYYY-MM-DD"),
  };
}

export function mergeTaskTimeLogs(
  projectId: string,
  tasks: Task[],
  timeLogs: Timelog[]
) {
  const tasksByProject = tasks.filter((task) => {
    return task.projectId === projectId;
  });

  const mergedTaskLogs = tasksByProject.map((task) => {
    const filterLogs = timeLogs.filter((timelog) => {
      return timelog.taskId === task.id;
    });
    const taskTimesLogs = filterLogs.map((timelog) => {
      const duration = timelog.duration.split(":");

      const totalMinutes =
        Number(duration[0]) * 60 +
        Number(duration[1]) +
        Number(duration[2]) / 60;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = Number((totalMinutes % 60).toFixed(0));

      return {
        ...timelog,
        minutes: totalMinutes,
        duration: `${hours < 10 ? "0" : ""}${hours}:${
          minutes < 10 ? "0" : ""
        }${minutes}`,
      };
    });

    const sum = reduceTime(taskTimesLogs);

    return {
      ...task,
      timelogs: taskTimesLogs,
      total: sum,
    };
  });

  const tasksTimelogs = mergedTaskLogs.filter((task) => {
    return task.timelogs.length;
  });

  return tasksTimelogs;
}

const reduceTime = (
  taskTimesLogs: TimelogMinutes[]
): { hours: number; minutes: number } => {
  const sumMinutes = taskTimesLogs.reduce(
    (total, timelog) => timelog.minutes + total,
    0
  );
  let hours = Math.floor(sumMinutes / 60);
  let minutes = Number((sumMinutes % 60).toFixed(0));

  if (minutes >= 15) minutes = 30;
  else if (minutes >= 30) {
    minutes = 0;
    hours = hours + 1;
  } else if (minutes <= 15) minutes = 15;

  return { hours, minutes };
};
