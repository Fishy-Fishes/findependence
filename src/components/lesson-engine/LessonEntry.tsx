import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "./GlassCard";
import { LessonBackground, LessonColors } from "./LessonBackground";

interface LessonUnit {
  number: string;
  title: string;
  meta: string;
}

/** Unit list from the Figma "Lesson Engine — Entry" frame. */
const UNITS: LessonUnit[] = [
  { number: "01", title: "Foundations of Cash Flow", meta: "2 lessons · 40 XP" },
  { number: "02", title: "Debt Shields & Traps", meta: "1 lesson · 15 XP" },
  { number: "03", title: "Balance Sheet Master", meta: "1 lesson · 20 XP" },
  { number: "04", title: "Community Wealth & ROSCA", meta: "1 lesson · 15 XP" },
];

const STATS: { label: string; value: string }[] = [
  { label: "UNITS", value: "4" },
  { label: "LESSONS", value: "5" },
  { label: "XP", value: "90" },
];

interface LessonEntryProps {
  /** Called when the user taps "Begin Lesson →". */
  onBeginLesson: () => void;
  /** Optional back handler; renders the ← glass button when provided. */
  onBack?: () => void;
}

/**
 * Implementation of the Figma "Lesson Engine — Entry" frame (133:413).
 * Gradient background with frosted-glass hero card, stat chips and unit list.
 */
export default function LessonEntry({ onBeginLesson, onBack }: LessonEntryProps) {
  return (
    <View style={styles.root}>
      <LessonBackground />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <Pressable
          onPress={onBack}
          disabled={!onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Financial Lesson’s</Text>
          <Text style={styles.subtitle}>Build your path to findependence</Text>

          <GlassCard radius={22} style={styles.heroCard}>
            <View style={styles.heroIconCircle}>
              <Text style={styles.heroIconText}>💰</Text>
            </View>
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroTitle}>Ready to master your money?</Text>
              <Text style={styles.heroSubtitle}>
                5 bite-sized lessons across 4 units.
              </Text>
              <Text style={styles.heroMeta}>90 XP · ~10 min</Text>
            </View>
          </GlassCard>

          <View style={styles.statsRow}>
            {STATS.map((stat) => (
              <GlassCard key={stat.label} style={styles.statChip}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </GlassCard>
            ))}
          </View>

          <Text style={styles.sectionLabel}>UNITS</Text>
          <View style={styles.unitList}>
            {UNITS.map((unit) => (
              <GlassCard key={unit.number} style={styles.unitRow}>
                <View style={styles.unitBadge}>
                  <Text style={styles.unitBadgeText}>{unit.number}</Text>
                </View>
                <View style={styles.unitTextBlock}>
                  <Text style={styles.unitTitle}>{unit.title}</Text>
                  <Text style={styles.unitMeta}>{unit.meta}</Text>
                </View>
              </GlassCard>
            ))}
          </View>
        </ScrollView>

        <Pressable
          onPress={onBeginLesson}
          style={({ pressed }) => [styles.ctaButton, pressed && styles.pressed]}
        >
          <Text style={styles.ctaText}>Begin Lesson →</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: LessonColors.glassFill,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    marginTop: 12,
  },
  backButtonText: {
    color: LessonColors.textPrimary,
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  subtitle: {
    fontSize: 15,
    color: LessonColors.textSecondary,
    marginTop: 4,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 16,
    marginTop: 56,
  },
  heroIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: LessonColors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconText: {
    fontSize: 26,
  },
  heroTextBlock: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: LessonColors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: LessonColors.textSecondary,
  },
  heroMeta: {
    fontSize: 13,
    fontWeight: "600",
    color: LessonColors.accentBlue,
  },
  statsRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 30,
  },
  statChip: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: LessonColors.textSecondary,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: LessonColors.textSecondary,
    marginTop: 22,
    marginBottom: 8,
    marginLeft: 2,
  },
  unitList: {
    gap: 8,
  },
  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  unitBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: LessonColors.glassFill,
    alignItems: "center",
    justifyContent: "center",
  },
  unitBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: LessonColors.textPrimary,
  },
  unitTextBlock: {
    flex: 1,
    gap: 2,
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: LessonColors.textPrimary,
  },
  unitMeta: {
    fontSize: 12,
    color: LessonColors.textSecondary,
  },
  ctaButton: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    height: 50,
    borderRadius: 18,
    backgroundColor: "rgba(250, 189, 47, 0.8)",
    borderWidth: 2,
    borderColor: LessonColors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    fontSize: 17,
    fontWeight: "600",
    color: LessonColors.textPrimary,
  },
});
