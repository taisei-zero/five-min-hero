import AsyncStorage from '@react-native-async-storage/async-storage';
import { Impulse } from '../domain/types';

const impulsesKey = 'impulses';

export async function appendImpulse(impulse: Impulse) {
  const raw = await AsyncStorage.getItem(impulsesKey);
  const list: Impulse[] = raw ? (JSON.parse(raw) as Impulse[]) : [];
  list.unshift(impulse);
  await AsyncStorage.setItem(impulsesKey, JSON.stringify(list));
}

export async function loadImpulses(): Promise<Impulse[]> {
  const raw = await AsyncStorage.getItem(impulsesKey);
  return raw ? (JSON.parse(raw) as Impulse[]) : [];
}

export async function clearImpulses() {
  await AsyncStorage.removeItem(impulsesKey);
}
