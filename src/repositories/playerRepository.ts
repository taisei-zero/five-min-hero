import AsyncStorage from '@react-native-async-storage/async-storage';
import { PlayerStats } from '../domain/player';

const playerKey = 'playerStats';

export async function loadPlayer(): Promise<PlayerStats> {
  const raw = await AsyncStorage.getItem(playerKey);
  if (raw) return JSON.parse(raw);

  const initial: PlayerStats = { willpowerXP: 0 };
  await AsyncStorage.setItem(playerKey, JSON.stringify(initial));
  return initial;
}

export async function savePlayer(stats: PlayerStats) {
  await AsyncStorage.setItem(playerKey, JSON.stringify(stats));
}
