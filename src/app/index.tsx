import * as Device from 'expo-device';
import { LinearGradient } from "expo-linear-gradient";
import { Platform, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useSQLKey } from '@/hooks/use-sql-key';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogIncome from '@/app/logincome';
import { useState } from 'react';
import { Button } from 'expo-router/build/react-navigation';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const [location] = useSQLKey("location");
  const [goal] = useSQLKey("goal");

  const [currentAmount, setCurrentAmount] = useState(0.0);
  const [goalAmount, setGoalAmount] = useState(1000.0);

  const [loggingIncome, setLoggingIncome] = useState(false);
  const ratio = 10

  return (
    <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={[{ color: '#ffffff' }]}> Welcome </ThemedText>
        <ThemedText type="subtitle" style={[{ color: '#ffffff' }]}>Findependence Goals</ThemedText>
        <ThemedText type="default" style={[{ color: '#aaaaaa' }]}>You'll need to save more before you move</ThemedText>
        <ThemedText type="default" style={[{ color: '#ffffff', textAlign: 'left' }]}>Bond</ThemedText>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${ratio + 20}%` }]} />
          <View style={[styles.progress, { width: '100%' }]} />
        </View>
        <ThemedText type="default" style={[{ color: '#ffffff', textAlign: 'left' }]}>Weekly income</ThemedText>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${ratio}%` }]} />
          <View style={[styles.progress, { width: '100%' }]} />
        </View>
        <ThemedText type="default" style={[{ color: '#ffffff', textAlign: 'left' }]}>Setup costs & emergency buffer</ThemedText>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${ratio}%` }]} />
          <View style={[styles.progress, { width: '100%' }]} />
        </View>
        <ThemedText type="subtitle" style={[{ color: '#ffffff', textAlign: 'left' }]}>Daily Progress</ThemedText>
        <ThemedText style={[{ color: '#dddddd', textAlign: 'left' }]}>Make sure to log or learn every day</ThemedText>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <ThemedText style={[styles.days, styles.green]}>9</ThemedText>
          <ThemedText style={[styles.days, styles.red]}>10</ThemedText>
          <ThemedText style={styles.days}>11</ThemedText>
          <ThemedText style={styles.days}>12</ThemedText>
          <ThemedText style={styles.days}>13</ThemedText>
          <ThemedText style={styles.days}>14</ThemedText>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={styles.card}>
            <ThemedText type="small">Today's task</ThemedText>
            <ThemedText>Learning about bonds</ThemedText>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#ffffff44',
    borderRadius: 10,
    padding: 10,
  },
  days: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 10,
    width: 40,
    borderRadius: 8,
    textAlign: 'center',
  },
  green: {
    backgroundColor: '#ACFA70',
  },
  red: {
    backgroundColor: '#EC4C4C',
  },
  container: { padding: 16, backgroundColor: "#fff", borderRadius: 12 },
  progress: {
    backgroundColor: "#ffffff88",
    height: 40,
    borderRadius: 10,
    position: 'absolute',
  },
  gradient: {
    height: '100%',
  },
  progressBar: {
    height: 40,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
});
