import React, { useEffect, useState } from "react";

import { useDashboard } from "../../context/DashboardContext";
import { Timelog } from "../../interfaces";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

type TimesWeekly = {
  day: string;
  timelogs: Timelog[];
  minutes: number;
  hours: number;
};

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TimeLineChart = () => {
  const { timelogs } = useDashboard();
  const [timePastWeek, setTimePastWeek] = useState<TimesWeekly[]>();

  useEffect(() => {
    timeLogsPastWeek();
  }, [timelogs]);

  const timeLogsPastWeek = () => {
    const weeklyTimelogs = timelogs
      .filter((timelog) => {
        if (
          dayjs(timelog.stopDate).isBetween(
            dayjs().subtract(7, "days"),
            dayjs()
          )
        )
          return timelog;
      })
      .map((timelog) => {
        const duration = timelog.duration.split(":");

        const totalMinutes =
          Number(duration[0]) * 60 +
          Number(duration[1]) +
          Number(duration[2]) / 60;

        const hours = Math.floor(totalMinutes / 60);
        const minutes = Number((totalMinutes % 60).toFixed(0));

        return {
          ...timelog,
          minutes,
          hours,
        };
      });

    let pastWeek: string[] = [];
    for (let i = 0; i <= 7; i++) {
      const day = dayjs()
        .subtract(7, "days")
        .add(i, "days")
        .format("YYYY-MM-DD");
      pastWeek.push(day);
    }

    const dayArray: TimesWeekly[] = [];
    for (let i = 0; i < pastWeek.length; i++) {
      const day = pastWeek[i];

      const timelogs = weeklyTimelogs.filter((timelog) =>
        timelog.stopDate.includes(day)
      );

      const sumMinutes: number = timelogs.reduce(
        (acc, el) => acc + el.minutes,
        0
      );
      const sumHours: number = timelogs.reduce((acc, el) => acc + el.hours, 0);

      const newObject = {
        day: pastWeek[i],
        timelogs,
        minutes: sumMinutes,
        hours: sumHours,
      };
      dayArray.push(newObject);
    }

    // Cumulative option
    dayArray.reduce(function (r: number[], a) {
      if (r.length > 0) a.minutes += r[r.length - 1];
      r.push(a.minutes);
      return r;
    }, []);

    setTimePastWeek(dayArray);
  };

  return (
    <ResponsiveContainer width="99%" height={300}>
      <div>
        <LineChart
          width={320}
          height={300}
          data={timePastWeek}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </ResponsiveContainer>
  );
};

export default TimeLineChart;
