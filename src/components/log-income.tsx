import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "./themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, TextInput, View } from "react-native";
import { Button } from 'expo-router/build/react-navigation';
import { Spacing } from "@/constants/theme";
import { ThemedText } from "./themed-text";
import { useState } from "react";

export default function LogIncome({ goal, current, setLoggingIncome }: { goal: number, current: number, setLoggingIncome: (logging: boolean) => void }) {
  const [paycheck, setPaycheck] = useState('');

  const p = paycheck.split('$').join('')
  const newPaycheck = parseFloat(p ? p : '0');

  const ratio = Math.max(Math.round(((newPaycheck + current) / goal) * 100), 10);

  return (
    <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
      <SafeAreaView>
        <ThemedView style={[{ justifyContent: 'space-around', display: 'flex' }, styles.enlargedContainer, styles.titleContainer]}>
          <View style={[{ width: '100%' }, styles.titleContainer]}>
            <ThemedText style={styles.title} type="subtitle">Log Income</ThemedText>
            <ThemedText style={styles.title} type="smallBold">Add a recent paycheck</ThemedText>
            <TextInput
              value={paycheck}
              style={[styles.input, styles.title]}
              onChangeText={(text) => {
                text = text.split('$').join('')
                const t = text.split('.')
                if (t.length >= 2) {
                  text = t[0] + '.' + t[1] + t.slice(2).join('')
                }
                setPaycheck(`$${text}`)
              }}
              keyboardType='numeric'
              placeholder="$0.00"
              placeholderTextColor="#ffffff44"
            // style={styles.input}
            />
            <ThemedText style={styles.title} type="smallBold">Saving Percent</ThemedText>
            <ThemedText style={styles.title}>${(newPaycheck + current).toFixed(2)} out of ${goal.toFixed(2)}</ThemedText>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${ratio}%` }]} />
              <View style={[styles.progress, { width: '100%' }]} />
            </View>
          </View>
          <View style={{ width: '100%' }}>
            <Button
              color="black"
              style={[styles.button, styles.main]}
              onPress={() => { setLoggingIncome(false) }}
            >
              Continue
            </Button>
            <Button
              color="black"
              style={[styles.button, styles.secondary]}
              onPress={() => { setLoggingIncome(false) }}
            >
              Back
            </Button>
          </View>
        </ThemedView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  progress: {
    backgroundColor: "#ffffff88",
    height: 40,
    borderRadius: 10,
    position: 'absolute',
  },
  main: {
    backgroundColor: 'white',
  },
  secondary: {
    backgroundColor: '#ffffff55',
  },
  progressBar: {
    height: 40,
    width: '100%',
  },
  button: {
    width: "100%",
    paddingVertical: 6,
    marginTop: 10,
    color: 'white',
  },
  input: {
    fontSize: 32,
  },
  enlargedContainer: {
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  title: {
    color: 'white',
  },
  padding: {
    paddingVertical: Spacing.two,
    paddingTop: Spacing.half,
  },
  gradient: {
    height: '100%',
  },
  card: {
    backdropFilter: "blur(10)",
    borderWidth: 1,
    width: '100%',
    borderRadius: 8,
    borderColor: '#ffffff88',
    backgroundColor: '#ffffff33',
    padding: 8,
  },
  fullCard: {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.six,
  },
  centerText: {
    textAlign: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  linkButton: {
    flexDirection: "row",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.half,
    borderRadius: 10,
    justifyContent: "center",
    gap: Spacing.one,
    alignItems: "center",
    backgroundColor: '#1D4C6E',
  },
  sectionsWrapper: {
    gap: Spacing.five,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  collapsibleContent: {
    alignItems: "center",
  },
  imageTutorial: {
    width: "100%",
    aspectRatio: 296 / 171,
    borderRadius: Spacing.three,
    marginTop: Spacing.two,
  },
  imageReact: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});
