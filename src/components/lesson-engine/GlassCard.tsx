import { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { LessonColors } from "./LessonBackground";

interface GlassCardProps {
  children?: ReactNode;
  /** Corner radius (default 16, matching the Figma glass rows). */
  radius?: number;
  /** Adds the 1px white stroke seen on the question card. */
  bordered?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Frosted-glass container used across the Lesson Engine screens.
 * Approximates the Figma BACKGROUND_BLUR with a translucent white fill.
 */
export function GlassCard({
  children,
  radius = 16,
  bordered = false,
  style,
}: GlassCardProps) {
  return (
    <View
      style={[
        styles.glass,
        { borderRadius: radius },
        bordered && styles.bordered,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: {
    backgroundColor: LessonColors.glassFill,
    overflow: "hidden",
  },
  bordered: {
    borderWidth: 1,
    borderColor: LessonColors.glassBorder,
  },
});
