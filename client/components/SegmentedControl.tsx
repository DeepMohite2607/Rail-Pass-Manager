import React from "react";
import { View, Pressable, StyleSheet, ViewStyle } from "react-native";
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
  const selectedIndex = options.findIndex((o) => o.value === value);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(
            selectedIndex * (100 / options.length) + "%",
            { damping: 15 }
          ),
        },
      ],
    };
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundSecondary },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.indicator,
          {
            width: `${100 / options.length}%` as any,
            backgroundColor: theme.backgroundDefault,
          },
          animatedStyle,
        ]}
      />
      {options.map((option, index) => (
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
