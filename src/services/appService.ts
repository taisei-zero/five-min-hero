import { DailyScore, Impulse, Result } from '../domain/types';
import { todayKey } from '../domain/date';
import { makeId } from '../domain/id';

import { loadDailyScore, saveDailyScore } from '../repositories/scoreRepository';
import { appendImpulse, clearImpulses, loadImpulses } from '../repositories/impulseRepository';
import { loadPlayer, savePlayer } from '../repositories/playerRepository';
import { PlayerStats } from '../domain/player';

export async function initAppData() {
  const date = todayKey();
  const score = await loadDailyScore(date);
  const impulses = await loadImpulses();
  const player = await loadPlayer();
  return { date, score, impulses, player };
}

export async function ensureTodayScore(currentDate: string) {
  const date = todayKey();
  if (date === currentDate) {
    return { changed: false as const, date, score: null as DailyScore | null };
  }
  const score = await loadDailyScore(date);
  return { changed: true as const, date, score };
}

export async function recordImpulse(
  score: DailyScore,
  result: Result,
  startedAt: string,
  trigger: string // ←追加
) {
  const finishedAt = new Date().toISOString();

  const impulse: Impulse = {
    id: makeId(),
    startedAt,
    finishedAt,
    result,
    trigger, // ←保存
  };

  await appendImpulse(impulse);

  const nextScore: DailyScore =
    result === 'SUCCESS'
      ? { ...score, successCount: score.successCount + 1 }
      : { ...score, failCount: score.failCount + 1 };

  await saveDailyScore(nextScore);

  const impulses = await loadImpulses();
  return { nextScore, impulses };
}

export async function resetTodayScore(score: DailyScore) {
  const next = { ...score, successCount: 0, failCount: 0 };
  await saveDailyScore(next);
  return next;
}

export async function clearAllImpulses() {
  await clearImpulses();
  return [];
}

export async function addXP(amount: number) {
  const player = await loadPlayer();
  const next: PlayerStats = {
    willpowerXP: Math.max(0, player.willpowerXP + amount),
  };
  await savePlayer(next);
  return next;
}
