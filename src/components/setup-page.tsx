import { Platform, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useSync } from '@/hooks/use-sync-context';
import { SyncError, restoreFromServer, syncToServer } from '@/lib/sync';
import { Button } from 'expo-router/build/react-navigation';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';

enum SetupScreen {
  LandingPage,
  Option,
  RecoverByCode,
  AboutYou,
  SetKeyphrase,
}

export default function SetupPage({ completeSetup }: { completeSetup: () => void }) {
  const db = useSQLiteContext();
  const { setKeyphrase } = useSync();

  const [screen, setScreen] = useState(SetupScreen.LandingPage);
  const [location, setLocation] = useState('');
  const [goal, setGoal] = useState('');
  const [keyphrase, setLocalKeyphrase] = useState('');

  const onSubmit = async () => {
    await db.runAsync("REPLACE INTO app (key, value) VALUES ('location', ?)", [location]);
    await db.runAsync("REPLACE INTO app (key, value) VALUES ('goal', ?)", [goal]);
    await db.runAsync("REPLACE INTO app (key, value) VALUES ('hasSetup', ?)", ['true']);

    setKeyphrase(keyphrase);
    await syncToServer(db, keyphrase);
    completeSetup();
  };

  switch (screen) {
    case SetupScreen.LandingPage:
      return <LandingPage setScreen={setScreen} />;
    case SetupScreen.Option:
      return <Option setScreen={setScreen} />;
    case SetupScreen.RecoverByCode:
      return (
        <RecoverByCode
          setScreen={setScreen}
          completeSetup={completeSetup}
        />
      );
    case SetupScreen.AboutYou:
      return (
        <AboutYou
          location={location}
          goal={goal}
          setScreen={setScreen}
          setLocation={setLocation}
          setGoal={setGoal}
          onContinue={() => setScreen(SetupScreen.SetKeyphrase)}
        />
      );
    case SetupScreen.SetKeyphrase:
      return (
        <SetKeyphrase
          keyphrase={keyphrase}
          setKeyphrase={setLocalKeyphrase}
          setScreen={setScreen}
          onSubmit={onSubmit}
        />
      );
  }
}

function LandingPage({ setScreen }: { setScreen: (s: SetupScreen) => void }) {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="subtitle" style={styles.title}>
              Findependence
            </ThemedText>
          </ThemedView>
          <Button
            style={[styles.button, styles.main]}
            color="black"
            onPress={() => {
              setScreen(SetupScreen.Option);
            }}
          >
            Gain your financial independence -{'>'}
          </Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  );
}

function Option({ setScreen }: { setScreen: (s: SetupScreen) => void }) {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="subtitle" style={styles.title}>
              Findependence
            </ThemedText>
          </ThemedView>
          <Button
            color="black"
            style={[styles.button, styles.main]}
            onPress={() => {
              setScreen(SetupScreen.AboutYou);
            }}
          >
            Continue
          </Button>
          <ThemedText style={styles.text}> ──── or ───── </ThemedText>
          <Button
            color="black"
            style={[styles.button, styles.secondary]}
            onPress={() => {
              setScreen(SetupScreen.RecoverByCode);
            }}
          >
            Recover By Keyphrase
          </Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  );
}

function RecoverByCode({
  setScreen,
  completeSetup,
}: {
  setScreen: (s: SetupScreen) => void;
  completeSetup: () => void;
}) {
  const db = useSQLiteContext();
  const { setKeyphrase } = useSync();
  const [keyphraseInput, setKeyphraseInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const onRestore = async () => {
    if (!keyphraseInput.trim()) {
      setError('Enter your secret keyphrase');
      return;
    }

    setIsRestoring(true);
    setError(null);
    try {
      await restoreFromServer(db, keyphraseInput.trim());
      setKeyphrase(keyphraseInput.trim());
      completeSetup();
    } catch (err) {
      setError(err instanceof SyncError ? err.message : 'Restore failed');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="subtitle" style={styles.title}>
              Restore Your Data
            </ThemedText>
            <ThemedText type="default" style={styles.heading}>
              Enter your secret keyphrase to unlock and restore your encrypted backup.
            </ThemedText>
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
            {error && (
              <ThemedText type="default" style={styles.error}>
                {error}
              </ThemedText>
            )}
          </ThemedView>
          <Button
            color="black"
            style={[styles.button, styles.main]}
            onPress={onRestore}
            disabled={isRestoring}
          >
            {isRestoring ? 'Restoring...' : 'Unlock & Restore'}
          </Button>
          <Button
            color="black"
            style={[styles.button, styles.secondary]}
            onPress={() => {
              setScreen(SetupScreen.Option);
            }}
          >
            Back
          </Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  );
}

type AboutYouProps = {
  setScreen: (s: SetupScreen) => void;
  setLocation: (s: string) => void;
  setGoal: (s: string) => void;
  onContinue: () => void;
  goal: string;
  location: string;
};

function AboutYou({
  setScreen,
  setLocation,
  setGoal,
  onContinue,
  goal,
  location,
}: AboutYouProps) {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="subtitle" style={styles.title}>
              Tell us about you
            </ThemedText>
            <ThemedText type="default" style={styles.heading}>
              Location
            </ThemedText>
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Your location"
              placeholderTextColor="#666"
              style={styles.input}
            />
            <ThemedText type="default" style={styles.heading}>
              Goal
            </ThemedText>
            <TextInput
              value={goal}
              onChangeText={setGoal}
              placeholder="Your financial goal"
              placeholderTextColor="#666"
              style={styles.input}
            />
          </ThemedView>
          <Button color="black" style={[styles.button, styles.main]} onPress={onContinue}>
            Continue
          </Button>
          <Button
            color="black"
            style={[styles.button, styles.secondary]}
            onPress={() => {
              setScreen(SetupScreen.Option);
            }}
          >
            Back
          </Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  );
}

function SetKeyphrase({
  keyphrase,
  setKeyphrase,
  setScreen,
  onSubmit,
}: {
  keyphrase: string;
  setKeyphrase: (s: string) => void;
  setScreen: (s: SetupScreen) => void;
  onSubmit: () => void;
}) {
  const [confirmKeyphrase, setConfirmKeyphrase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onContinue = async () => {
    if (keyphrase.length < 8) {
      setError('Keyphrase must be at least 8 characters');
      return;
    }
    if (keyphrase !== confirmKeyphrase) {
      setError('Keyphrases do not match');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit();
    } catch {
      setError('Could not save backup. Make sure the sync server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="subtitle" style={styles.title}>
              Secure Your Data
            </ThemedText>
            <ThemedText type="default" style={styles.heading}>
              Choose a secret keyphrase. Your data is encrypted with it and can be restored after
              reinstalling the app.
            </ThemedText>
            <TextInput
              value={keyphrase}
              onChangeText={setKeyphrase}
              placeholder="Secret keyphrase"
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              value={confirmKeyphrase}
              onChangeText={setConfirmKeyphrase}
              placeholder="Confirm keyphrase"
              placeholderTextColor="#666"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            {error && (
              <ThemedText type="default" style={styles.error}>
                {error}
              </ThemedText>
            )}
          </ThemedView>
          <Button
            color="black"
            style={[styles.button, styles.main]}
            onPress={onContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
          <Button
            color="black"
            style={[styles.button, styles.secondary]}
            onPress={() => {
              setScreen(SetupScreen.AboutYou);
            }}
          >
            Back
          </Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  main: {
    backgroundColor: 'white',
  },
  secondary: {
    backgroundColor: '#ffffff55',
  },
  gradient: {
    width: '100%',
  },
  text: {
    color: 'white',
  },
  error: {
    color: '#ffb4b4',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderRadius: 4,
    backgroundColor: '#ffffffbb',
    width: '100%',
    padding: 5,
  },
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
    width: '100%',
    flex: 1,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
    color: 'white',
  },
  heading: {
    textAlign: 'left',
    color: 'white',
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
