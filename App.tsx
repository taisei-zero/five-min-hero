import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';

import { Result, DailyScore, Impulse } from './src/domain/types';
import { pad2 } from './src/domain/date';
import { PlayerStats } from './src/domain/player';

import {
  initAppData,
  ensureTodayScore,
  recordImpulse,
  resetTodayScore,
  clearAllImpulses,
  addXP,
} from './src/services/appService';

import { Abstinence } from './src/domain/abstinence';
import { initAbstinence, resetAbstinence, setTargetHours } from './src/services/abstinenceService';

import HomeScreen from './src/screens/HomeScreen';
import TimerScreen from './src/screens/TimerScreen';
import HistoryScreen from './src/screens/HistoryScreen';

export default function App() {
  const [screen, setScreen] = useState<'HOME' | 'TIMER' | 'HISTORY'>('HOME');

  const [date, setDate] = useState('');
  const [score, setScore] = useState<DailyScore | null>(null);
  const [impulses, setImpulses] = useState<Impulse[]>([]);
  const [player, setPlayer] = useState<PlayerStats>({ willpowerXP: 0 });

  // ✅ おな禁タイマー
  const [abstinence, setAbstinenceState] = useState<Abstinence | null>(null);

  // timer
  const TOTAL = 5 * 60;
  const [remaining, setRemaining] = useState(TOTAL);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef<string | null>(null);

  const mmss = useMemo(() => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${pad2(m)}:${pad2(s)}`;
  }, [remaining]);

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    startedAtRef.current = null;
    setRemaining(TOTAL);
  };

  const refreshDateIfNeeded = async () => {
    const res = await ensureTodayScore(date);
    if (res.changed) {
      setDate(res.date);
      setScore(res.score);
    }
  };

  useEffect(() => {
    (async () => {
      const data = await initAppData();
      setDate(data.date);
      setScore(data.score);
      setImpulses(data.impulses);
      setPlayer(data.player);

      // ✅ おな禁タイマー初期ロード
      const a = await initAbstinence();
      setAbstinenceState(a);
    })();
  }, []);

  const start = async () => {
    await refreshDateIfNeeded();

    setRemaining(TOTAL);
    startedAtRef.current = new Date().toISOString();
    setScreen('TIMER');

    stopTimer();
    timerRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const finish = async (result: Result, trigger: string) => {
    await refreshDateIfNeeded();
    if (!score) return;

    const startedAt = startedAtRef.current ?? new Date().toISOString();

    const saved = await recordImpulse(score, result, startedAt, trigger);
    setScore(saved.nextScore);
    setImpulses(saved.impulses);

    const xpDelta = result === 'SUCCESS' ? 10 : -5;
    const nextPlayer = await addXP(xpDelta);
    setPlayer(nextPlayer);

    stopTimer();
    setScreen('HOME');
  };

  const cancel = () => {
    stopTimer();
    setScreen('HOME');
  };

  const goHistory = () => setScreen('HISTORY');
  const backHome = () => setScreen('HOME');

  const clearHistory = async () => {
    const after = await clearAllImpulses();
    setImpulses(after);
  };

  const resetToday = async () => {
    await refreshDateIfNeeded();
    if (!score) return;
    const next = await resetTodayScore(score);
    setScore(next);
  };

  // ✅ おな禁タイマー操作
  const onResetAbstinence = async () => {
    const next = await resetAbstinence();
    setAbstinenceState(next);
  };

  const onChangeTarget = async (hours: number) => {
    const next = await setTargetHours(hours);
    setAbstinenceState(next);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {screen === 'HOME' && (
        <HomeScreen
          date={date}
          score={score}
          playerXP={player.willpowerXP}
          abstinence={abstinence}
          onChangeTarget={onChangeTarget}
          onResetAbstinence={onResetAbstinence}
          onStart={start}
          onGoHistory={goHistory}
          onResetToday={resetToday}
        />
      )}

      {screen === 'TIMER' && (
        <TimerScreen mmss={mmss} onComplete={finish} onCancel={cancel} onStopTimer={stopTimer} />
      )}

      {screen === 'HISTORY' && (
        <HistoryScreen impulses={impulses} onBack={backHome} onClear={clearHistory} />
      )}
    </SafeAreaView>
  );
}
