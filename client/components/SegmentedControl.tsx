import React, { useState } from "react";
import { View, Pressable, StyleSheet, ViewStyle, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface SegmentedControlProps<T extends string> {
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  const { theme } = useTheme();
  const [containerWidth, setContainerWidth] = useState(0);
  const selectedIndex = options.findIndex((o) => o.value === value);
  
  const segmentWidth = containerWidth > 0 ? (containerWidth - Spacing.xs * 2) / options.length : 0;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(selectedIndex * segmentWidth, { damping: 15, stiffness: 150 }),
        },
      ],
    };
  }, [selectedIndex, segmentWidth]);

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        { backgroundColor: theme.backgroundSecondary },
        style,
      ]}
    >
      {containerWidth > 0 ? (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: segmentWidth,
              backgroundColor: theme.backgroundDefault,
            },
            animatedStyle,
          ]}
        />
      ) : null}
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={styles.option}
        >
          <ThemedText
            style={[
              styles.optionText,
              option.value === value && { color: theme.primary, fontWeight: "600" },
            ]}
          >
            {option.label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: BorderRadius.xs,
    padding: Spacing.xs,
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: Spacing.xs,
    bottom: Spacing.xs,
    left: Spacing.xs,
    borderRadius: BorderRadius.xs - 2,
  },
  option: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: "center",
    zIndex: 1,
  },
  optionText: {
    fontSize: 14,
  },
});
