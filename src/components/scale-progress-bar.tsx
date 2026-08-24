import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View, ViewStyle } from 'react-native';

export interface ProgressSegment {
  ratio: number; // between 0 and 1
  color: string;
}

export interface ScaleProgressBarProps {
  progress?: number; // 0 to 1 or 0 to 100
  color?: string;
  segments?: ProgressSegment[];
  label?: string;
  height?: number;
  style?: ViewStyle;
}

export function ScaleProgressBar({
  progress = 0,
  color = '#94EB68',
  segments,
  label,
  height = 46,
  style,
}: ScaleProgressBarProps) {
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0 && Math.abs(width - containerWidth) > 1) {
      setContainerWidth(width);
    }
  };

  // Geometry parameters for the fish scale dot matrix
  const numRows = 5;
  const dotSize = 5.5;
  const colPitch = 8.5; // distance between columns
  const rowPitch = 6.8;
  const sidePadding = 10;
  const topPadding = (height - ((numRows - 1) * rowPitch + dotSize)) / 2;

  // Normalize single progress (support 0-1 or 0-100)
  const normalizedProgress = progress > 1 ? progress / 100 : Math.max(0, Math.min(1, progress));

  // Determine active segments and cumulative limits
  const activeSegments = segments
    ? segments.map((s) => ({
        ratio: s.ratio > 1 ? s.ratio / 100 : Math.max(0, Math.min(1, s.ratio)),
        color: s.color,
      }))
    : [{ ratio: normalizedProgress, color }];

  let cumulative = 0;
  const cumulativeSegments = activeSegments.map((s) => {
    const start = cumulative;
    cumulative += s.ratio;
    return {
      start,
      end: Math.min(1, cumulative),
      color: s.color,
    };
  });

  const totalFilledRatio = Math.min(1, cumulative);

  // Render dots
  const renderDots = () => {
    if (containerWidth <= 0) return null;

    const availableWidth = containerWidth - sidePadding * 2;
    const totalColumns = Math.floor(availableWidth / colPitch);
    const dots = [];

    for (let r = 0; r < numRows; r++) {
      const isOddRow = r % 2 === 1;
      const rowOffset = isOddRow ? colPitch / 2 : 0;
      const y = topPadding + r * rowPitch;

      for (let c = 0; c < totalColumns; c++) {
        const x = sidePadding + c * colPitch + rowOffset;
        const normalizedX = (x - sidePadding) / availableWidth;

        if (normalizedX > totalFilledRatio) {
          continue;
        }

        // Find matching segment color
        const matchingSeg = cumulativeSegments.find(
          (seg) => normalizedX >= seg.start && normalizedX <= seg.end
        );

        if (matchingSeg) {
          dots.push(
            <View
              key={`dot-${r}-${c}`}
              style={[
                styles.dot,
                {
                  left: x,
                  top: y,
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: matchingSeg.color,
                },
              ]}
            />
          );
        }
      }
    }

    return dots;
  };

  return (
    <View
      style={[styles.container, { height }, style]}
      onLayout={handleLayout}
      accessible={true}
      accessibilityRole="progressbar"
    >
      {/* Background Fish Scale Dots */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {renderDots()}
      </View>

      {/* Value / Target Label on the right */}
      {label ? (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.28)',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
  },
  labelContainer: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
