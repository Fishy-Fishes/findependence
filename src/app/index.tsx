import * as Device from 'expo-device';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import Roadmap from '@/components/roadmap';
import { useSQLKey } from '@/hooks/use-sql-key';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="small">
          Location: {location}
          Goal: {goal}
        </ThemedText>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", borderRadius: 12 },
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
