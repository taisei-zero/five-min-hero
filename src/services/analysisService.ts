import { Impulse } from '../domain/types';

export type TriggerStats = {
  trigger: string;
  total: number;
  success: number;
  fail: number;
};

export type TimeZones = {
  朝: number;
  昼: number;
  夜: number;
};

export function analyzeTriggers(impulses: Impulse[]): TriggerStats[] {
  const map: Record<string, TriggerStats> = {};
あ
  for (const i of impulses) {
    const key = i.trigger || '未設定';
    if (!map[key]) {
      map[key] = { trigger: key, total: 0, success: 0, fail: 0 };
    }
    map[key].total += 1;
    if (i.result === 'SUCCESS') map[key].success += 1;
    else map[key].fail += 1;
  }

  return Object.values(map).sort((a, b) => b.total - a.total);
}

export function analyzeTimeZone(impulses: Impulse[]): TimeZones {
  const zones: TimeZones = { 朝: 0, 昼: 0, 夜: 0 };

  for (const i of impulses) {
    const hour = new Date(i.finishedAt).getHours();
    if (hour < 10) zones.朝 += 1;
    else if (hour < 18) zones.昼 += 1;
    else zones.夜 += 1;
  }

  return zones;
}

export function generateHint(triggerStats: TriggerStats[], zones: TimeZones): string {
  if (triggerStats.length === 0) return 'データがまだ足りません';

  const topTrigger = triggerStats[0]?.trigger ?? '不明';

  const zoneEntries: Array<[keyof TimeZones, number]> = [
    ['朝', zones.朝],
    ['昼', zones.昼],
    ['夜', zones.夜],
  ];

  const topZone = zoneEntries.sort((a, b) => b[1] - a[1])[0][0];

  return `注意ポイント：トリガーは「${topTrigger}」、時間帯は「${topZone}」が多め。先回りで環境調整しよう。`;
}
