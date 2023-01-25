import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";

import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sabado",
];

export const New = () => {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState("");

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      );
    } else {
      setWeekDays((prevState) => [...prevState, weekDayIndex]);
    }
  }

  async function handleCreateNewHabit() {
    try {
      if (!title.trim()) {
        Alert.alert("Novo Hábito", "Informe o nome do hábito");
        return;
      }

      if (weekDays.length === 0) {
        Alert.alert("Novo Hábito", "Escolha a periodicidade");
        return;
      }

      await api.post("/habit", {
        title,
        weekDays,
      });

      Alert.alert("Novo Hábito", "Hábito criado com sucesso!");

      setTitle("");
      setWeekDays([]);
    } catch (error) {
      console.log(error);

      Alert.alert("Ops!", "Não foi possivel criar um novo hábito");
    }
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className='mt-6 text-white font-extrabold text-3xl'>
          Criar hábito
        </Text>

        <Text className='mt-6 text-white font-semibold text-base'>
          Qual seu comprometimento?
        </Text>

        <TextInput
          className='
            h-12 
            pl-4 
            rounded-lg 
            mt-3 
            bg-zinc-900 
            text-white
            border-2
            border-zinc-800
            focus:border-green-600'
          placeholder='Exercicios, dormir bem, etc....'
          placeholderTextColor={colors.zinc[400]}
          value={title}
          onChangeText={setTitle}
        />

        <Text className='font-semibold mt-4 mb-3 text-white text-base'>
          Qual a recorrencia?
        </Text>

        {availableWeekDays.map((weekDay, index) => (
          <Checkbox
            title={weekDay}
            key={index}
            checked={weekDays.includes(index)}
            onPress={() => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          className='w-ful h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name='check' size={20} color={colors.white} />

          <Text className='font-semibold text-base text-white ml-2'>
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
