import { Platform, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'expo-router/build/react-navigation';
import { useState } from 'react';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useSync } from '@/hooks/use-sync-context';
import { SyncError } from '@/lib/sync';

export default function SettingsScreen() {
  const {
    keyphrase,
    syncNow,
    isSyncing,
    lastSyncedAt,
    lastSyncError,
  } = useSync();
  const [keyphraseInput, setKeyphraseInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const unlockAndSync = async () => {
    const phrase = keyphrase ?? keyphraseInput.trim();
    if (!phrase) {
      setStatusMessage('Enter your secret keyphrase to sync');
      return;
    }

    setStatusMessage(null);
    try {
      await syncNow(phrase);
      setStatusMessage('Backup synced successfully');
      setKeyphraseInput('');
    } catch (error) {
      setStatusMessage(error instanceof SyncError ? error.message : 'Sync failed');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            Settings
          </ThemedText>
        </ThemedView>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <ThemedText type="default">Encrypted cloud backup</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Your data is encrypted with your secret keyphrase before leaving this device.
          </ThemedText>

          {!keyphrase && (
            <TextInput
              value={keyphraseInput}
              onChangeText={setKeyphraseInput}
              placeholder="Secret keyphrase"
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          )}

          {keyphrase && (
            <ThemedText type="small" themeColor="textSecondary">
              Unlocked for this session
            </ThemedText>
          )}

          <Button
            color="black"
            style={styles.syncButton}
            onPress={unlockAndSync}
            disabled={isSyncing}
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>

          {lastSyncedAt && (
            <ThemedText type="small" themeColor="textSecondary">
              Last synced: {lastSyncedAt.toLocaleString()}
            </ThemedText>
          )}

          {(statusMessage || lastSyncError) && (
            <ThemedText type="small" style={styles.status}>
              {statusMessage ?? lastSyncError}
            </ThemedText>
          )}
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
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
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  input: {
    height: 40,
    borderRadius: 4,
    backgroundColor: '#ffffffbb',
    width: '100%',
    padding: 5,
  },
  syncButton: {
    backgroundColor: 'white',
    width: '100%',
  },
  status: {
    color: '#ffb4b4',
    textAlign: 'center',
  },
});
