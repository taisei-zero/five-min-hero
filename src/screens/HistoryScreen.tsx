import React from 'react';
import { Text, View, Pressable, Alert, FlatList } from 'react-native';
import { Impulse } from '../domain/types';
import { analyzeTriggers, analyzeTimeZone, generateHint } from '../services/analysisService';

type Props = {
  impulses: Impulse[];
  onBack: () => void;
  onClear: () => void;
};

export default function HistoryScreen({ impulses, onBack, onClear }: Props) {
  const triggerStats = analyzeTriggers(impulses);
  const zones = analyzeTimeZone(impulses);
  const hint = generateHint(triggerStats, zones);

  const renderItem = ({ item }: { item: Impulse }) => {
    const t = new Date(item.finishedAt);
    return (
      <View style={{ paddingVertical: 10, borderBottomWidth: 1 }}>
        <Text>
          {item.result === 'SUCCESS' ? '✅' : '❌'} {item.trigger}
        </Text>
        <Text style={{ fontSize: 12 }}>{t.toISOString().replace('T', ' ').slice(0, 19)}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>履歴 & 分析</Text>

      {/* トリガーランキング */}
      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontWeight: '700' }}>トリガーTOP</Text>
        {triggerStats.slice(0, 3).map((t) => (
          <Text key={t.trigger}>
            {t.trigger}：{t.total}回（成功{t.success}/失敗{t.fail}）
          </Text>
        ))}
      </View>

      {/* 時間帯分析 */}
      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontWeight: '700' }}>時間帯分析</Text>
        <Text>朝：{zones.朝}</Text>
        <Text>昼：{zones.昼}</Text>
        <Text>夜：{zones.夜}</Text>
      </View>

      {/* 改善ヒント */}
      <View style={{ padding: 12, borderWidth: 1, borderRadius: 12 }}>
        <Text style={{ fontWeight: '700' }}>改善ヒント</Text>
        <Text>{hint}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <FlatList
          data={impulses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Pressable
          onPress={onBack}
          style={{ flex: 1, padding: 14, borderWidth: 1, borderRadius: 12, alignItems: 'center' }}
        >
          <Text>戻る</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Alert.alert('履歴削除', '全削除しますか？', [
              { text: 'キャンセル', style: 'cancel' },
              { text: '削除', style: 'destructive', onPress: onClear },
            ]);
          }}
          style={{ flex: 1, padding: 14, borderWidth: 1, borderRadius: 12, alignItems: 'center' }}
        >
          <Text>履歴クリア</Text>
        </Pressable>
      </View>
    </View>
  );
}
