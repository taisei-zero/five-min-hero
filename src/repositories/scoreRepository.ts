import AsyncStorage from '@react-native-async-storage/async-storage';
import { DailyScore } from '../domain/types';
import { makeId } from '../domain/id';

const scoreStorageKey = (date: string) => `dailyScore:${date}`;

export async function loadDailyScore(date: string): Promise<DailyScore> {
  const raw = await AsyncStorage.getItem(scoreStorageKey(date));
  if (raw) return JSON.parse(raw) as DailyScore;

  const initial: DailyScore = { id: makeId(), date, successCount: 0, failCount: 0 };
  await AsyncStorage.setItem(scoreStorageKey(date), JSON.stringify(initial));
  return initial;
}

export async function saveDailyScore(score: DailyScore) {
  await AsyncStorage.setItem(scoreStorageKey(score.date), JSON.stringify(score));
}
