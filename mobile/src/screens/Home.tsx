import { useState, useCallback } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import dayjs from "dayjs";

import { HabitDay, DAY_SIZE } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

import { api } from "../lib/axios";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

const datesFromYearsStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysFill = minimumSummaryDatesSize - datesFromYearsStart.length;

type ISummary = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

export const Home = () => {
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ISummary>([]);

  async function fetchData() {
    try {
      setLoading(true);

      const { data } = await api.get("/summary");

      setSummary(data);
    } catch (error) {
      console.log(error);

      Alert.alert("Ops!!", "Não possivel carregar o sumario de hábitos.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  if (loading) {
    return <Loading />;
  }

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
        {summary && (
          <View className='flex-row flex-wrap'>
            {datesFromYearsStart.map((date) => {
              const dayWithHabits = summary.find((day) =>
                dayjs(date).isSame(day.date, "day")
              );

              return (
                <HabitDay
                  date={date}
                  amountCompleted={dayWithHabits?.completed}
                  amountOfHabit={dayWithHabits?.amount}
                  key={date.toISOString()}
                  onPress={() =>
                    navigate("habit", { date: date.toISOString() })
                  }
                />
              );
            })}

            {amountOfDaysFill > 0 &&
              Array.from({ length: amountOfDaysFill }).map((_, index) => (
                <View
                  key={index}
                  className='bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40'
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                ></View>
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};
