import AsyncStorage from '@react-native-async-storage/async-storage';
import { Abstinence, DEFAULT_ABSTINENCE } from '../domain/abstinence';

const key = 'abstinence';

export async function loadAbstinence(): Promise<Abstinence> {
  const raw = await AsyncStorage.getItem(key);
  if (raw) return JSON.parse(raw) as Abstinence;

  await AsyncStorage.setItem(key, JSON.stringify(DEFAULT_ABSTINENCE));
  return DEFAULT_ABSTINENCE;
}

export async function saveAbstinence(data: Abstinence) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}
