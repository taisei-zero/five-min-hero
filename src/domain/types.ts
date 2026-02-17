export type Result = 'SUCCESS' | 'FAIL';

export type Impulse = {
  id: string;
  startedAt: string;
  finishedAt: string;
  result: Result;
  trigger: string; // ←追加
};

export type DailyScore = {
  id: string;
  date: string;
  successCount: number;
  failCount: number;
};
