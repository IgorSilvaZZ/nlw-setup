import { useState, useEffect } from "react";
import dayjs from "dayjs";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { HabitDay } from "./HabitDay";

import { api } from "../lib/axios";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const summaryDates = generateDatesFromYearBeginning();

const minimumSummaryDatesSize = 18 * 7; // 18 weeks
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length;

type ISummary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export const SummaryTable = () => {
  const [summary, setSummary] = useState<ISummary>([]);

  useEffect(() => {
    api.get("/summary").then(({ data }) => {
      setSummary(data);
    });
  }, []);

  return (
    <div className='w-full flex'>
      <div className='grid grid-rows-7 grid-flow-row gap-3'>
        {weekDays.map((day, index) => (
          <div
            className='text-zinc-400 font-bold text-xl h-10 w-10 flex items-center justify-center'
            key={index}
          >
            {day}
          </div>
        ))}
      </div>

      <div className='grid grid-rows-7 grid-flow-col gap-3'>
        {summary.length > 0 &&
          summaryDates.map((date) => {
            const dayInSummary = summary.find((day) => {
              return dayjs(date).isSame(day.date, "day");
            });

            return (
              <HabitDay
                amount={dayInSummary?.amount}
                date={date}
                defaultCompleted={dayInSummary?.completed}
                key={date.toString()}
              />
            );
          })}

        {amountOfDaysToFill > 0 &&
          Array.from({ length: amountOfDaysToFill }).map((_, index) => (
            <div
              key={index}
              className='w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed'
            ></div>
          ))}
      </div>
    </div>
  );
};
