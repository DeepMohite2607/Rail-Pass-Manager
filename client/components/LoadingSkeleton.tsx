import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = BorderRadius.xs,
  style,
}: SkeletonProps) {
  const { theme } = useTheme();
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.6, 0.3]);
    return { opacity };
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: theme.backgroundTertiary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

export function ApplicationCardSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Skeleton width="60%" height={24} />
        <Skeleton width={80} height={24} borderRadius={12} />
      </View>
      <Skeleton width="100%" height={1} style={styles.divider} />
      <View style={styles.details}>
        <View style={styles.row}>
          <Skeleton width="40%" height={16} />
          <Skeleton width="40%" height={16} />
        </View>
        <Skeleton width="50%" height={14} />
      </View>
    </View>
  );
}

export function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ApplicationCardSkeleton />
      <ApplicationCardSkeleton />
      <ApplicationCardSkeleton />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    marginVertical: Spacing.sm,
  },
  details: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loadingContainer: {
    padding: Spacing.lg,
  },
});
