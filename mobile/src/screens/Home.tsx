import { Text, View, ScrollView } from "react-native";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearsStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysFill = minimumSummaryDatesSize - datesFromYearsStart.length;

export const Home = () => {
  return (
    <View className='flex-1 bg-background p-8 pt-16'>
      <Header />

      <View className='flex-row mt-6 mb-2'>
        {weekDays.map((weekDay, index) => (
          <Text
            key={`${weekDay}- ${index}`}
            className='text-zinc-400 text-xl font-bold text-center mx-1'
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className='flex-row flex-wrap'>
          {datesFromYearsStart.map((date) => (
            <HabitDay key={date.toISOString()} />
          ))}

          {amountOfDaysFill > 0 &&
            Array.from({ length: amountOfDaysFill }).map((_, index) => (
              <View
                key={index}
                className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
              ></View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};
