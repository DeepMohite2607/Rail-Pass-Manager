import React, { useState, useCallback, useEffect } from "react";
import { View, FlatList, StyleSheet, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { PassCard } from "@/components/PassCard";
import { LoadingScreen } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { ApplicationStorage } from "@/lib/storage";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ConcessionApplication } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function StudentHomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [applications, setApplications] = useState<ConcessionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadApplications = useCallback(async () => {
    try {
      const apps = await ApplicationStorage.getApplications();
      setApplications(apps);
    } catch (error) {
      console.error("Failed to load applications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [loadApplications])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadApplications();
  }, [loadApplications]);

  const activePass = applications.find(
    (app) => app.status === "railway_approved"
  );

  const pendingCount = applications.filter(
    (app) => app.status === "submitted" || app.status === "college_approved"
  ).length;

  const approvedCount = applications.filter(
    (app) => app.status === "railway_approved"
  ).length;

  const handleApply = () => {
    navigation.navigate("ApplyForm");
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
  };

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <ThemedText style={[styles.greeting, { color: theme.textSecondary }]}>
        Welcome back,
      </ThemedText>
      <ThemedText type="h2">
        {user?.fullName || "Student"}
      </ThemedText>

      {activePass ? (
        <View style={styles.passSection}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Active Pass
          </ThemedText>
          <PassCard application={activePass} onDownload={handleDownload} />
        </View>
      ) : (
        <Card
          style={[styles.applyCard, { borderColor: theme.primary }]}
          onPress={handleApply}
        >
          <View style={styles.applyCardContent}>
            <View
              style={[styles.applyIcon, { backgroundColor: `${theme.primary}15` }]}
            >
              <Feather name="plus-circle" size={32} color={theme.primary} />
            </View>
            <View style={styles.applyTextContainer}>
              <ThemedText type="h3">Apply for Concession</ThemedText>
              <ThemedText
                style={[styles.applySubtext, { color: theme.textSecondary }]}
              >
                Submit a new railway concession application
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={24} color={theme.primary} />
          </View>
        </Card>
      )}

      <View style={styles.statsSection}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          Quick Stats
        </ThemedText>
        <View style={styles.statsRow}>
          <View
            style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
          >
            <ThemedText style={[styles.statNumber, { color: theme.pending }]}>
              {pendingCount}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Pending
            </ThemedText>
          </View>
          <View
            style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
          >
            <ThemedText style={[styles.statNumber, { color: theme.success }]}>
              {approvedCount}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Approved
            </ThemedText>
          </View>
          <View
            style={[styles.statCard, { backgroundColor: theme.backgroundDefault }]}
          >
            <ThemedText style={[styles.statNumber, { color: theme.text }]}>
              {applications.length}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: theme.textSecondary }]}
            >
              Total
            </ThemedText>
          </View>
        </View>
      </View>

      {!activePass && applications.length > 0 ? (
        <Button onPress={handleApply} style={styles.applyButton}>
          Apply for New Concession
        </Button>
      ) : null}
    </View>
  );

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[
            styles.loadingContainer,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: tabBarHeight + Spacing.xl,
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
      <FlatList
        data={[]}
        renderItem={null}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
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
  content: {
    paddingHorizontal: Spacing.lg,
  },
  headerContent: {
    gap: Spacing.xs,
  },
  greeting: {
    fontSize: 14,
  },
  passSection: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  applyCard: {
    marginTop: Spacing.xl,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  applyCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  applyIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyTextContainer: {
    flex: 1,
  },
  applySubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  statsSection: {
    marginTop: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  applyButton: {
    marginTop: Spacing.xl,
  },
});
