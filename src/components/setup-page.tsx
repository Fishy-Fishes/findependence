import { Platform, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Button } from 'expo-router/build/react-navigation';
import { useEffect, useState } from 'react';

enum SetupScreen {
  LandingPage,
  Option,
  RecoverByCode,
}

export default function setupPage({ completeSetup }: { completeSetup: () => void }) {
  const firstRunComplete = async () => {
    // completeSetup();
  }

  const [screen, setScreen] = useState(SetupScreen.LandingPage);

  switch (screen) {
    case SetupScreen.LandingPage:
      return <LandingPage setScreen={setScreen} />
    case SetupScreen.Option:
      return <Option setScreen={setScreen} />
    case SetupScreen.RecoverByCode:
      return <RecoverByCode setScreen={setScreen} />
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
          <Button style={[styles.button, styles.main]} color='black' onPress={() => { setScreen(SetupScreen.Option) }}>Gain your financial independence -{'>'}</Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  )
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
          <Button color='black' style={[styles.button, styles.main]} onPress={() => { setScreen(SetupScreen.Option) }}>Continue</Button>
          <ThemedText style={styles.text}> ──── or ───── </ThemedText>
          <Button color='gray' style={styles.button} onPress={() => { setScreen(SetupScreen.RecoverByCode) }}>Recover By Code</Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  )
}

function RecoverByCode({ setScreen }: { setScreen: (s: SetupScreen) => void }) {
  return (
    <ThemedView style={styles.container}>
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <ThemedText type="subtitle" style={styles.title}>
              Findependence
            </ThemedText>
          </ThemedView>
          <TextInput style={{ height: 40, borderColor: 'black', borderWidth: 1, borderRadius: 4, backgroundColor: '#ffffffbb', width: '100%', padding: 5 }}>Hello</TextInput>
          <Button color='black' style={[styles.button, styles.main]} onPress={() => { setScreen(SetupScreen.Option) }}>Continue</Button>
          <ThemedText style={styles.text}> ──── or ───── </ThemedText>
          <Button color='gray' style={styles.button} onPress={() => { setScreen(SetupScreen.Option) }}>Recover By Code</Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
  },
  main: {
    // backgroundColor: "white",
  },
  gradient: {
    width: '100%',
  },
  text: {
    color: "white",
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
    flex: 1,
    paddingHorizontal: Spacing.four,
    backgroundColor: 'transparent',
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
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
