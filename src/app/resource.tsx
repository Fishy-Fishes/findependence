import { useQuery } from "@tanstack/react-query";
import {
  Platform,
  ScrollView,
  Text,
} from "react-native";
import { Pressable, StyleSheet } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from 'expo-router/build/react-navigation';
import { LinearGradient } from "expo-linear-gradient";
import { ExternalPathString } from "expo-router";
import { useState } from "react";

async function fetchResources(): Promise<Resource[]> {
  const loopback = (Platform.OS === 'android' ? '10.0.2.2' : 'localhost')
  const response = await fetch(`http://${loopback}:3000/resources`);
  if (!response.ok) throw new Error('Network error');
  return response.json();
}

export default function Resources() {
  const [resource, setResource] = useState<Resource | null>(null);
  const { data, error, isLoading } = useQuery({
    queryKey: ['resources'],
    queryFn: fetchResources,
    refetchInterval: 1000,
  });

  if (isLoading) {
    return (
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView>
          <ThemedView style={styles.titleContainer}>
            <Text>Loading...</Text>
          </ThemedView>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  if (error) {
    return (
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView>
          <ThemedView style={styles.titleContainer}>
            <Text>Unexpected error, please try again later.</Text>
          </ThemedView>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  if (resource) {
    return (
      <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
        <SafeAreaView>
          <ThemedView style={[styles.enlargedContainer, styles.titleContainer]}>
            <ThemedText style={styles.title} type="subtitle">Resources</ThemedText>
            <EnlargedCard resource={resource} onBack={() => setResource(null)} />
          </ThemedView>
        </SafeAreaView>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient style={styles.gradient} colors={['#292F56', '#008CA4', '#ACFA70']}>
      <SafeAreaView>
        <ScrollView>
          <ThemedView style={styles.titleContainer}>
            <ThemedText style={styles.title} type="subtitle">Resources</ThemedText>
            {/*
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            This starter app includes example{"\n"}code to help you get started.
          </ThemedText>
              <ExternalLink href="https://docs.expo.dev" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkButton}>
                <ThemedText type="link">Expo documentation</ThemedText>
              </ThemedView>
            </Pressable>
          </ExternalLink> */}

            {data && data.map(d => <ResourceCard key={d.id} resource={d} onPress={() => setResource(d)} />)}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

interface Resource {
  id: string,
  title: string,
  description: string,
  short_description: string,
  image: string | null,
  worth: string,
  link: ExternalPathString,
}

function ResourceCard({ resource: { title, description, short_description, image, worth, link }, onPress }: { resource: Resource, onPress: () => void }) {
  return (
    <ThemedView style={styles.card}>
      <Pressable onPress={() => onPress()}>
        <ThemedView style={styles.padding}>
          <ThemedText style={styles.title} type="smallBold">{title}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.padding}>
          <ThemedText style={styles.title} type="small">{short_description}</ThemedText>
        </ThemedView>
        <ExternalLink href={link} asChild>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.linkButton}>
              <ThemedText type="link" style={styles.title}>{link}</ThemedText>
            </ThemedView>
          </Pressable>
        </ExternalLink>
      </Pressable>
    </ThemedView>
  )
}

function EnlargedCard({ resource: { title, description, worth, link }, onBack }: { resource: Resource, onBack: () => void }) {
  return (
    <ThemedView style={[styles.fullCard, styles.card]}>
      <ThemedView>
        <ThemedView style={styles.padding}>
          <ThemedText style={styles.title} type="default">{title}</ThemedText>
        </ThemedView>
        {worth &&
          <ThemedView style={styles.padding}>
            <ThemedText style={styles.title} type="small">{worth}</ThemedText>
          </ThemedView>
        }
        <ThemedView style={styles.padding}>
          <ThemedText style={styles.title} type="small">{description}</ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView>
        <ExternalLink href={link} asChild>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <ThemedView type="backgroundElement" style={styles.linkButton}>
              <ThemedText type="link" style={styles.title}>{link}</ThemedText>
            </ThemedView>
          </Pressable>
        </ExternalLink>
        <Button color='black' style={[styles.linkButton, styles.button, styles.secondary]} onPress={onBack}>Back</Button>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 6,
    marginTop: 10,
    color: 'white',
  },
  enlargedContainer: {
    height: '100%',
  },
  secondary: {
    backgroundColor: "#ffffff55",
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
