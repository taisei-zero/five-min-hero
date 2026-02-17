export type PlayerStats = {
  willpowerXP: number;
};

export function calculateLevel(xp: number) {
  if (xp < 100) return 1;
  if (xp < 300) return 2;
  if (xp < 600) return 3;
  if (xp < 1000) return 4;
  return 5;
}

export function nextLevelXP(level: number) {
  const table: Record<number, number> = {
    1: 100,
    2: 300,
    3: 600,
    4: 1000,
    5: 2000,
  };
  return table[level] ?? 2000;
}

export function getTitle(level: number) {
  if (level >= 10) return '欲望ブレイカー';
  if (level >= 5) return '意志の戦士';
  if (level >= 3) return '見習い勇者';
  return '新兵';
}
