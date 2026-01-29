import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { BorderRadius, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/useTheme";
import { ApplicationStatus } from "@/types";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { theme } = useTheme();

  const getStatusConfig = () => {
    switch (status) {
      case "submitted":
        return {
          label: "Submitted",
          backgroundColor: theme.pending,
        };
      case "college_approved":
        return {
          label: "College Approved",
          backgroundColor: theme.warning,
        };
      case "railway_approved":
        return {
          label: "Approved",
          backgroundColor: theme.success,
        };
      case "rejected":
        return {
          label: "Rejected",
          backgroundColor: theme.error,
        };
      default:
        return {
          label: "Unknown",
          backgroundColor: theme.textSecondary,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <ThemedText style={styles.text}>{config.label}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    alignSelf: "flex-start",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});
