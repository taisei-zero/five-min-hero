import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, Pressable, Alert } from 'react-native';
import {
  Abstinence,
  diffMs,
  formatDuration,
  remainingToTarget,
  isAchieved,
} from '../domain/abstinence';

type Props = {
  abstinence: Abstinence;
  onChangeTarget: (hours: number) => Promise<void> | void;
  onReset: () => Promise<void> | void;
};

const TARGETS = [
  { label: '3日', hours: 72 },
  { label: '7日', hours: 168 },
  { label: '30日', hours: 720 },
];

export default function AbstinenceCard({ abstinence, onChangeTarget, onReset }: Props) {
  // 1分ごとに表示更新（必要最低限）
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1_000);
    return () => clearInterval(id);
  }, []);

  const elapsedMs = useMemo(() => diffMs(abstinence.lastResetAt), [abstinence.lastResetAt, tick]);
  const elapsed = useMemo(() => formatDuration(elapsedMs), [elapsedMs]);

  const remainMs = useMemo(
    () => remainingToTarget(elapsedMs, abstinence.targetHours),
    [elapsedMs, abstinence.targetHours]
  );
  const remain = useMemo(() => formatDuration(remainMs), [remainMs]);
  const achieved = useMemo(
    () => isAchieved(elapsedMs, abstinence.targetHours),
    [elapsedMs, abstinence.targetHours]
  );

  return (
    <View style={{ padding: 12, borderWidth: 1, borderRadius: 12, gap: 8 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>🚫 おな禁タイマー</Text>

      <Text style={{ fontSize: 16, fontWeight: '700' }}>
        経過：{elapsed.days}日 {elapsed.hours}時間 {elapsed.mins}分 {elapsed.secs}秒
      </Text>

      <Text>目標：{Math.round(abstinence.targetHours / 24)}日</Text>

      <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
        {TARGETS.map((t) => (
          <Pressable
            key={t.hours}
            onPress={() => onChangeTarget(t.hours)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderWidth: 1,
              borderRadius: 10,
              opacity: abstinence.targetHours === t.hours ? 1 : 0.7,
            }}
          >
            <Text>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        onPress={() => {
          Alert.alert('リセットしますか？', '「最後に抜いた」を今に更新します。', [
            { text: 'キャンセル', style: 'cancel' },
            { text: 'リセット', style: 'destructive', onPress: () => onReset() },
          ]);
        }}
        style={{ padding: 12, borderWidth: 1, borderRadius: 12, alignItems: 'center' }}
      >
        <Text style={{ fontWeight: '700' }}>最後に抜いた（リセット）</Text>
      </Pressable>
    </View>
  );
}
