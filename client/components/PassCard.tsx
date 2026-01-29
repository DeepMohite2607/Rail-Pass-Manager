import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { ConcessionApplication } from "@/types";

interface PassCardProps {
  application: ConcessionApplication;
  onDownload?: () => void;
}

export function PassCard({ application, onDownload }: PassCardProps) {
  const { theme } = useTheme();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.primary }, Shadows.lg]}>
      <View style={styles.header}>
        <View style={styles.railwayBadge}>
          <Feather name="navigation" size={20} color={theme.primary} />
        </View>
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title}>Railway Concession Pass</ThemedText>
          <ThemedText style={styles.subtitle}>
            {application.collegeName}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.body, { backgroundColor: theme.backgroundDefault }]}>
        <View style={styles.qrSection}>
          {application.qrCode ? (
            <Image
              source={{ uri: application.qrCode }}
              style={styles.qrCode}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.qrPlaceholder,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <Feather name="grid" size={60} color={theme.textSecondary} />
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <ThemedText style={[styles.label, { color: theme.textSecondary }]}>
              Student Name
            </ThemedText>
            <ThemedText style={styles.value}>
              {application.studentName}
            </ThemedText>
          </View>

          <View style={styles.routeRow}>
            <View style={styles.stationBox}>
              <ThemedText
                style={[styles.stationLabel, { color: theme.textSecondary }]}
              >
                From
              </ThemedText>
              <ThemedText style={styles.stationName}>
                {application.sourceStation}
              </ThemedText>
            </View>
            <Feather name="arrow-right" size={24} color={theme.primary} />
            <View style={styles.stationBox}>
              <ThemedText
                style={[styles.stationLabel, { color: theme.textSecondary }]}
              >
                To
              </ThemedText>
              <ThemedText style={styles.stationName}>
                {application.destinationStation}
              </ThemedText>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.gridItem}>
              <ThemedText
                style={[styles.gridLabel, { color: theme.textSecondary }]}
              >
                Class
              </ThemedText>
              <ThemedText style={styles.gridValue}>
                {application.travelClass === "1st" ? "First" : "Second"}
              </ThemedText>
            </View>
            <View style={styles.gridItem}>
              <ThemedText
                style={[styles.gridLabel, { color: theme.textSecondary }]}
              >
                Duration
              </ThemedText>
              <ThemedText style={styles.gridValue}>
                {application.duration === "monthly" ? "Monthly" : "Quarterly"}
              </ThemedText>
            </View>
            <View style={styles.gridItem}>
              <ThemedText
                style={[styles.gridLabel, { color: theme.textSecondary }]}
              >
                Valid From
              </ThemedText>
              <ThemedText style={styles.gridValue}>
                {formatDate(application.validFrom)}
              </ThemedText>
            </View>
            <View style={styles.gridItem}>
              <ThemedText
                style={[styles.gridLabel, { color: theme.textSecondary }]}
              >
                Valid To
              </ThemedText>
              <ThemedText style={styles.gridValue}>
                {formatDate(application.validTo)}
              </ThemedText>
            </View>
          </View>
        </View>

        {onDownload ? (
          <Button onPress={onDownload} style={styles.downloadButton}>
            Download PDF
          </Button>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  railwayBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    marginLeft: Spacing.md,
    flex: 1,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
  },
  body: {
    padding: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  qrSection: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  qrCode: {
    width: 120,
    height: 120,
  },
  qrPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xs,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSection: {
    gap: Spacing.md,
  },
  infoRow: {
    gap: 2,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  stationBox: {
    flex: 1,
    gap: 2,
  },
  stationLabel: {
    fontSize: 12,
  },
  stationName: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridItem: {
    width: "50%",
    paddingVertical: Spacing.sm,
  },
  gridLabel: {
    fontSize: 12,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  downloadButton: {
    marginTop: Spacing.lg,
  },
});
