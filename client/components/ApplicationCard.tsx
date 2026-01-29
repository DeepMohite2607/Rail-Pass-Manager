import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { ThemedText } from "@/components/ThemedText";
import { StatusBadge } from "@/components/StatusBadge";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";
import { ConcessionApplication } from "@/types";

interface ApplicationCardProps {
  application: ConcessionApplication;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function ApplicationCard({ application, onPress }: ApplicationCardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.card,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
        animatedStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.route}>
          <ThemedText type="h4">{application.sourceStation}</ThemedText>
          <Feather
            name="arrow-right"
            size={16}
            color={theme.primary}
            style={styles.arrow}
          />
          <ThemedText type="h4">{application.destinationStation}</ThemedText>
        </View>
        <StatusBadge status={application.status} />
      </View>

      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Class
            </ThemedText>
            <ThemedText style={styles.detailValue}>
              {application.travelClass === "1st" ? "First Class" : "Second Class"}
            </ThemedText>
          </View>
          <View style={styles.detailItem}>
            <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
              Duration
            </ThemedText>
            <ThemedText style={styles.detailValue}>
              {application.duration === "monthly" ? "Monthly" : "Quarterly"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.dateRow}>
          <Feather name="calendar" size={14} color={theme.textSecondary} />
          <ThemedText style={[styles.dateText, { color: theme.textSecondary }]}>
            Applied on {formatDate(application.createdAt)}
          </ThemedText>
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  route: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing.sm,
  },
  arrow: {
    marginHorizontal: Spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  details: {
    gap: Spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    gap: Spacing.xl,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  dateText: {
    fontSize: 12,
  },
});
