import React from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import { DailyScore } from '../domain/types';
import { calculateLevel, nextLevelXP, getTitle } from '../domain/player';

import { Abstinence } from '../domain/abstinence';
import AbstinenceCard from '../components/AbstinenceCard';

type Props = {
  date: string;
  score: DailyScore | null;
  playerXP: number;

  abstinence: Abstinence | null;
  onChangeTarget: (hours: number) => Promise<void> | void;
  onResetAbstinence: () => Promise<void> | void;

  onStart: () => void;
  onGoHistory: () => void;
  onResetToday: () => void;
};

export default function HomeScreen({
  date,
  score,
  playerXP,
  abstinence,
  onChangeTarget,
  onResetAbstinence,
  onStart,
  onGoHistory,
  onResetToday,
}: Props) {
  const level = calculateLevel(playerXP);
  const nextXP = nextLevelXP(level);
  const title = getTitle(level);

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 28, fontWeight: '700' }}>5分耐えたら強くなる</Text>
      <Text style={{ fontSize: 14 }}>Date: {date}</Text>

      {/* ✅ おな禁タイマー */}
      {abstinence && (
        <AbstinenceCard
          abstinence={abstinence}
          onChangeTarget={onChangeTarget}
          onReset={onResetAbstinence}
        />
      )}

      {/* ✅ ゲーム要素：XP/レベル/称号 */}
      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 6 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>
          🔥 Lv{level} - {title}
        </Text>
        <Text>意志力: {playerXP}</Text>
        <Text>次Lvまで: {Math.max(0, nextXP - playerXP)}</Text>
      </View>

      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>今日のスコア</Text>
        <Text>✅ 成功: {score?.successCount ?? 0}</Text>
        <Text>❌ 失敗: {score?.failCount ?? 0}</Text>
      </View>

      <Pressable
        onPress={onStart}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600' }}>今やばい（5分開始）</Text>
      </Pressable>

      <Pressable
        onPress={onGoHistory}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' }}
      >
        <Text>履歴を見る</Text>
      </Pressable>

      <Pressable
        onPress={() => {
          Alert.alert('今日の記録をリセット', 'success/fail を 0 にします。よい？', [
            { text: 'キャンセル', style: 'cancel' },
            { text: 'リセット', style: 'destructive', onPress: onResetToday },
          ]);
        }}
        style={{ padding: 14, borderRadius: 12, borderWidth: 1, alignItems: 'center' }}
      >
        <Text>今日の記録をリセット</Text>
      </Pressable>
    </View>
  );
}
