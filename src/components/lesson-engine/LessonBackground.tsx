import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

/**
 * Shared screen background from the Figma "Lesson Engine" frames.
 * Diagonal gradient: deep navy -> teal -> lime green.
 */
export function LessonBackground() {
  return (
    <LinearGradient
      colors={["#292F56", "#008CA4", "#ACFA70"]}
      locations={[0, 0.52, 1]}
      start={{ x: 0.3, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  );
}

/** Colors lifted from the Figma Lesson Engine frames. */
export const LessonColors = {
  glassFill: "rgba(255, 255, 255, 0.18)",
  glassBorder: "rgba(255, 255, 255, 0.35)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  accentBlue: "#7DCBFC",
  amber: "#FABD2F",
  optionFill: "#F7F7F7",
  optionText: "#000000",
  ctaFill: "#000000",
} as const;
