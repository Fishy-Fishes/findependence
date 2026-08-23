import { useQuery } from "@tanstack/react-query";
import {
  Text,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

async function fetchResources() {
  const response = await fetch('http://localhost:3000/resources');
  if (!response.ok) throw new Error('Network error');
  return response.json();
}

export default function Resources() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
  });

  if (isLoading) {
    return (
      <SafeAreaView>
        <ThemedView style={styles.titleContainer}>
          <Text>Loading...</Text>
        </ThemedView>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView>
        <ThemedView style={styles.titleContainer}>
          <Text>Unexpected error, please try again later.</Text>
        </ThemedView>
      </SafeAreaView>
    )
  }

  console.log(data)

  return (
    <SafeAreaView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Explore</ThemedText>
        <ThemedText style={styles.centerText} themeColor="textSecondary">
          This starter app includes example{"\n"}code to help you get started.
        </ThemedText>

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.linkButton}>
              <ThemedText type="link">Expo documentation</ThemedText>
            </ThemedView>
          </Pressable>
        </ExternalLink>
      </ThemedView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    maxWidth: MaxContentWidth,
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
    paddingVertical: Spacing.two,
    borderRadius: Spacing.five,
    justifyContent: "center",
    gap: Spacing.one,
    alignItems: "center",
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
