import React, { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import ConfettiCannon from 'react-native-confetti-cannon';

type Props = {
  mmss: string;
  onComplete: (result: 'SUCCESS' | 'FAIL', trigger: string) => Promise<void> | void;
  onCancel: () => void;
  onStopTimer: () => void; // 追加
};

const TRIGGERS = ['暇', 'ストレス', '疲労', '夜', 'SNS', '習慣'];

export default function TimerScreen({ mmss, onComplete, onCancel, onStopTimer }: Props) {
  const [status, setStatus] = useState<'IDLE' | 'SELECT'>('IDLE');
  const [result, setResult] = useState<'SUCCESS' | 'FAIL' | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);

  const handleResult = async (kind: 'SUCCESS' | 'FAIL') => {
    onStopTimer(); // ★ここで止める（これが本命）

    setResult(kind);
    setStatus('SELECT');

    if (kind === 'SUCCESS') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setConfettiKey((k) => k + 1);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  };

  const handleTrigger = async (trigger: string) => {
    if (!result) return;
    await onComplete(result, trigger);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', gap: 16 }}>
      {confettiKey > 0 && (
        <ConfettiCannon key={confettiKey} count={120} origin={{ x: 0, y: 0 }} fadeOut />
      )}

      <Text style={{ fontSize: 48, fontWeight: '800', textAlign: 'center' }}>{mmss}</Text>

      {status === 'IDLE' && (
        <>
          <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
            <Pressable
              onPress={() => handleResult('SUCCESS')}
              style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}
            >
              <Text>成功</Text>
            </Pressable>

            <Pressable
              onPress={() => handleResult('FAIL')}
              style={{ padding: 14, borderRadius: 12, borderWidth: 1 }}
            >
              <Text>失敗</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={onCancel}
            style={{ padding: 12, borderRadius: 12, borderWidth: 1, alignSelf: 'center' }}
          >
            <Text>キャンセル</Text>
          </Pressable>
        </>
      )}

      {status === 'SELECT' && (
        <>
          <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: '700' }}>
            今回の原因は？
          </Text>

          <View style={{ gap: 8 }}>
            {TRIGGERS.map((t) => (
              <Pressable
                key={t}
                onPress={() => handleTrigger(t)}
                style={{ padding: 12, borderWidth: 1, borderRadius: 10 }}
              >
                <Text>{t}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}
    </View>
  );
}
