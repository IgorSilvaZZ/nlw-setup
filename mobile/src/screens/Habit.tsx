import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";

interface HabitParams {
  date: string;
}

interface DayInfo {
  possibleHabits: [
    {
      id: string;
      title: string;
    }
  ];
  completedHabits: string[];
}

export const Habit = () => {
  const route = useRoute();

  const [loading, setLoading] = useState(true);

  const [dayInfo, setDayInfo] = useState<DayInfo | null>(null);

  const { date } = route.params as HabitParams;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  async function fetchHabits() {
    try {
      setLoading(true);

      const { data } = await api.get("/day", {
        params: {
          date,
        },
      });

      setDayInfo(data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops!",
        "Não foi possivel carregar as informações dos hábitos!"
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
          {dayOfWeek}
        </Text>

        <Text className='text-white font-extrabold text-3xl'>
          {dayAndMonth}
        </Text>

        <ProgressBar progress={70} />

        <View className='mt-6'>
          <Checkbox title='Beber 2L de água' checked={false} />
          <Checkbox title='Caminhar' checked={true} />
        </View>
      </ScrollView>
    </View>
  );
};
