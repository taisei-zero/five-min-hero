export type Abstinence = {
  lastResetAt: string; // ISO
  targetHours: number; // 目標（時間）
};

export const DEFAULT_ABSTINENCE: Abstinence = {
  lastResetAt: new Date().toISOString(),
  targetHours: 72, // 3日
};

export function diffMs(fromISO: string, to = new Date()) {
  const from = new Date(fromISO).getTime();
  const toMs = to.getTime();
  if (Number.isNaN(from)) return 0;
  return Math.max(0, toMs - from);
}

// ✅ 秒まで返す
export function formatDuration(ms: number) {
  const totalSec = Math.floor(ms / 1000);

  const days = Math.floor(totalSec / (60 * 60 * 24));
  const hours = Math.floor((totalSec - days * 60 * 60 * 24) / (60 * 60));
  const mins = Math.floor((totalSec - days * 60 * 60 * 24 - hours * 60 * 60) / 60);
  const secs = totalSec % 60;

  return { days, hours, mins, secs };
}

export function remainingToTarget(msElapsed: number, targetHours: number) {
  const targetMs = targetHours * 60 * 60 * 1000;
  return Math.max(0, targetMs - msElapsed);
}

export function isAchieved(msElapsed: number, targetHours: number) {
  return msElapsed >= targetHours * 60 * 60 * 1000;
}
