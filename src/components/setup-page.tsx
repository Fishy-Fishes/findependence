import { Platform, StyleSheet, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { Button } from 'expo-router/build/react-navigation';
import { useState } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

enum SetupScreen {
  LandingPage,
  Option,
  RecoverByCode,
  AboutYou,
}

export default function SetupPage({ completeSetup }: { completeSetup: () => void }) {
  const db = useSQLiteContext();

  const onSubmit = async () => {
    await db.runAsync("REPLACE INTO app (key, value) VALUES ('location', ?)", [location]);
    await db.runAsync("REPLACE INTO app (key, value) VALUES ('goal', ?)", [goal]);
    completeSetup();
  }

  const [screen, setScreen] = useState(SetupScreen.LandingPage);
  const [location, setLocation] = useState("");
  const [goal, setGoal] = useState("");

  switch (screen) {
    case SetupScreen.LandingPage:
      return <LandingPage setScreen={setScreen} />
    case SetupScreen.Option:
      return <Option setScreen={setScreen} />
    case SetupScreen.RecoverByCode:
      return <RecoverByCode setScreen={setScreen} />
    case SetupScreen.AboutYou:
      return <AboutYou location={location} goal={goal} setScreen={setScreen} setLocation={setLocation} setGoal={setGoal} onSubmit={onSubmit} />
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
          <Button color='black' style={[styles.button, styles.main]} onPress={() => { setScreen(SetupScreen.AboutYou) }}>Continue</Button>
          <ThemedText style={styles.text}> ──── or ───── </ThemedText>
          <Button color='black' style={[styles.button, styles.secondary]} onPress={() => { setScreen(SetupScreen.RecoverByCode) }}>Recover By Code</Button>

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
              Recovery Code
            </ThemedText>
            <ThemedText type="default" style={styles.heading}>
              Recovery Code
            </ThemedText>
            <TextInput style={{ height: 40, borderRadius: 4, backgroundColor: '#ffffffbb', width: '100%', padding: 5 }}>Hello</TextInput>
          </ThemedView>
          <Button color='black' style={[styles.button, styles.main]} onPress={() => { setScreen(SetupScreen.Option) }}>Continue</Button>
          <Button color='black' style={[styles.button, styles.secondary]} onPress={() => { setScreen(SetupScreen.Option) }}>Back</Button>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </LinearGradient>
    </ThemedView>
  )
}

type AboutYouProps = {
  setScreen: (s: SetupScreen) => void,
  setLocation: (s: string) => void,
  setGoal: (s: string) => void,
  onSubmit: () => void,
  goal: string,
  location: string
}

function AboutYou({ setScreen, setLocation, setGoal, onSubmit, goal, location }: AboutYouProps) {
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
            <TextInput onChangeText={setLocation} style={{ height: 40, borderRadius: 4, backgroundColor: '#ffffffbb', width: '100%', padding: 5 }}>{location}</TextInput>
            <ThemedText type="default" style={styles.heading}>
              Goal
            </ThemedText>
            <TextInput onChangeText={setGoal} style={{ height: 40, borderRadius: 4, backgroundColor: '#ffffffbb', width: '100%', padding: 5 }}>{goal}</TextInput>
          </ThemedView>
          <Button color='black' style={[styles.button, styles.main]} onPress={onSubmit}>Continue</Button>
          <Button color='black' style={[styles.button, styles.secondary]} onPress={() => { setScreen(SetupScreen.Option) }}>Back</Button>

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
    backgroundColor: "white",
  },
  secondary: {
    backgroundColor: "#ffffff55",
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
