import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, RefreshControl, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { LoadingScreen } from "@/components/LoadingSkeleton";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { ApplicationStorage } from "@/lib/storage";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ConcessionApplication } from "@/types";

export default function AdminDashboardScreen() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const [applications, setApplications] = useState<ConcessionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isRailwayAdmin = user?.role === "railway_admin";

  const loadApplications = useCallback(async () => {
    try {
      const apps = await ApplicationStorage.getApplications();
      const filtered = isRailwayAdmin
        ? apps.filter((a) => a.status === "college_approved")
        : apps.filter((a) => a.status === "submitted");
      setApplications(filtered);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isRailwayAdmin]);

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [loadApplications])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadApplications();
  }, [loadApplications]);

  const handleApprove = async (application: ConcessionApplication) => {
    try {
      const newStatus = isRailwayAdmin ? "railway_approved" : "college_approved";
      const updates: Partial<ConcessionApplication> = {
        status: newStatus,
        ...(isRailwayAdmin
          ? { railwayApprovedAt: new Date().toISOString(), qrCode: "generated" }
          : { collegeApprovedAt: new Date().toISOString() }),
      };

      await ApplicationStorage.updateApplication(application.id, updates);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      loadApplications();
    } catch (error) {
      Alert.alert("Error", "Failed to approve application.");
    }
  };

  const handleReject = async (application: ConcessionApplication) => {
    Alert.prompt(
      "Reject Application",
      "Please provide a reason for rejection:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async (reason: string | undefined) => {
            try {
              await ApplicationStorage.updateApplication(application.id, {
                status: "rejected",
                rejectionReason: reason || "Application rejected",
              });
              await Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Warning
              );
              loadApplications();
            } catch (error) {
              Alert.alert("Error", "Failed to reject application.");
            }
          },
        },
      ],
      "plain-text",
      ""
    );
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  const renderApplicationItem = ({ item }: { item: ConcessionApplication }) => (
    <View
      style={[
        styles.applicationCard,
        { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View>
          <ThemedText type="h4">{item.studentName}</ThemedText>
          <ThemedText
            style={[styles.cardSubtitle, { color: theme.textSecondary }]}
          >
            {item.collegeName} - {item.department}
          </ThemedText>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <View style={[styles.cardDivider, { backgroundColor: theme.border }]} />

      <View style={styles.routeInfo}>
        <View style={styles.routeItem}>
          <ThemedText
            style={[styles.routeLabel, { color: theme.textSecondary }]}
          >
            From
          </ThemedText>
          <ThemedText style={styles.routeValue}>
            {item.sourceStation}
          </ThemedText>
        </View>
        <Feather name="arrow-right" size={20} color={theme.primary} />
        <View style={styles.routeItem}>
          <ThemedText
            style={[styles.routeLabel, { color: theme.textSecondary }]}
          >
            To
          </ThemedText>
          <ThemedText style={styles.routeValue}>
            {item.destinationStation}
          </ThemedText>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Class
          </ThemedText>
          <ThemedText style={styles.detailValue}>
            {item.travelClass === "1st" ? "First" : "Second"}
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
            Duration
          </ThemedText>
          <ThemedText style={styles.detailValue}>
            {item.duration === "monthly" ? "Monthly" : "Quarterly"}
          </ThemedText>
        </View>
        <View style={styles.detailItem}>
          <ThemedText style={[styles.detailLabel, { color: theme.textSecondary }]}>
            PRN
          </ThemedText>
          <ThemedText style={styles.detailValue}>{item.prn}</ThemedText>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable
          onPress={() => handleReject(item)}
          style={[
            styles.actionButton,
            styles.rejectButton,
            { backgroundColor: `${theme.error}15` },
          ]}
        >
          <Feather name="x" size={18} color={theme.error} />
          <ThemedText style={[styles.actionButtonText, { color: theme.error }]}>
            Reject
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => handleApprove(item)}
          style={[
            styles.actionButton,
            styles.approveButton,
            { backgroundColor: theme.success },
          ]}
        >
          <Feather name="check" size={18} color="#FFFFFF" />
          <ThemedText style={[styles.actionButtonText, { color: "#FFFFFF" }]}>
            Approve
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );

  const pendingCount = applications.length;

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[
            styles.loadingContainer,
            {
              paddingTop: insets.top + Spacing["2xl"],
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <LoadingScreen />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + Spacing.lg,
            backgroundColor: theme.primary,
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View>
            <ThemedText style={styles.headerTitle}>
              {isRailwayAdmin ? "Railway Authority" : "College Admin"}
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              {pendingCount} pending {pendingCount === 1 ? "application" : "applications"}
            </ThemedText>
          </View>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Feather name="log-out" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicationItem}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: insets.bottom + Spacing.xl,
          },
          applications.length === 0 && styles.emptyContent,
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Pending Applications"
            description={
              isRailwayAdmin
                ? "All college-approved applications have been processed"
                : "All student applications have been reviewed"
            }
          />
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 2,
  },
  logoutButton: {
    padding: Spacing.sm,
  },
  content: {
    padding: Spacing.lg,
  },
  emptyContent: {
    flexGrow: 1,
  },
  applicationCard: {
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  routeInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.md,
  },
  routeItem: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  routeValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  detailItem: {},
  detailLabel: {
    fontSize: 11,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  rejectButton: {},
  approveButton: {},
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
