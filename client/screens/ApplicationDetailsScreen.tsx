import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { StatusBadge } from "@/components/StatusBadge";
import { PassCard } from "@/components/PassCard";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { LoadingScreen } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { ApplicationStorage } from "@/lib/storage";
import { Spacing, BorderRadius } from "@/constants/theme";
import { ConcessionApplication, ApplicationStatus } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type ApplicationDetailsScreenRouteProp = RouteProp<
  RootStackParamList,
  "ApplicationDetails"
>;

interface TimelineStep {
  status: ApplicationStatus | "created";
  label: string;
  completed: boolean;
  date?: string;
  isError?: boolean;
}

export default function ApplicationDetailsScreen() {
  const route = useRoute<ApplicationDetailsScreenRouteProp>();
  const { applicationId } = route.params;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();

  const [application, setApplication] = useState<ConcessionApplication | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplication();
  }, [applicationId]);

  const loadApplication = async () => {
    try {
      const app = await ApplicationStorage.getApplicationById(applicationId);
      setApplication(app);
    } catch (error) {
      console.error("Failed to load application:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeline = (): TimelineStep[] => {
    if (!application) return [];

    const isRejected = application.status === "rejected";

    return [
      {
        status: "created",
        label: "Application Created",
        completed: true,
        date: application.createdAt,
      },
      {
        status: "submitted",
        label: "Submitted for Review",
        completed: true,
        date: application.createdAt,
      },
      {
        status: "college_approved",
        label: isRejected ? "College Rejected" : "College Approved",
        completed:
          application.status === "college_approved" ||
          application.status === "railway_approved" ||
          isRejected,
        date: application.collegeApprovedAt,
        isError: isRejected,
      },
      {
        status: "railway_approved",
        label: "Railway Approved",
        completed: application.status === "railway_approved",
        date: application.railwayApprovedAt,
      },
    ];
  };

  const handleDownload = () => {
    Alert.alert("Download", "PDF download functionality would be implemented here.");
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View
          style={[
            styles.loadingContainer,
            {
              paddingTop: headerHeight + Spacing.xl,
              paddingBottom: insets.bottom + Spacing.xl,
            },
          ]}
        >
          <LoadingScreen />
        </View>
      </ThemedView>
    );
  }

  if (!application) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.errorContainer}>
          <ThemedText>Application not found</ThemedText>
        </View>
      </ThemedView>
    );
  }

  const timeline = getTimeline();

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.header}>
          <StatusBadge status={application.status} />
        </View>

        {application.status === "railway_approved" ? (
          <View style={styles.passSection}>
            <PassCard application={application} onDownload={handleDownload} />
          </View>
        ) : null}

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Journey Details
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
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
              <View style={styles.arrowContainer}>
                <Feather name="arrow-right" size={24} color={theme.primary} />
              </View>
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

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.detailsGrid}>
              <View style={styles.gridItem}>
                <ThemedText
                  style={[styles.gridLabel, { color: theme.textSecondary }]}
                >
                  Class
                </ThemedText>
                <ThemedText style={styles.gridValue}>
                  {application.travelClass === "1st" ? "First Class" : "Second Class"}
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
                  {formatDate(application.validFrom).split(",")[0]}
                </ThemedText>
              </View>
              <View style={styles.gridItem}>
                <ThemedText
                  style={[styles.gridLabel, { color: theme.textSecondary }]}
                >
                  Valid To
                </ThemedText>
                <ThemedText style={styles.gridValue}>
                  {formatDate(application.validTo).split(",")[0]}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="h3" style={styles.sectionTitle}>
            Status Timeline
          </ThemedText>
          <View
            style={[
              styles.card,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            {timeline.map((step, index) => (
              <View key={step.status} style={styles.timelineItem}>
                <View style={styles.timelineIndicator}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: step.completed
                          ? step.isError
                            ? theme.error
                            : theme.success
                          : theme.border,
                      },
                    ]}
                  >
                    {step.completed ? (
                      <Feather
                        name={step.isError ? "x" : "check"}
                        size={12}
                        color="#FFFFFF"
                      />
                    ) : null}
                  </View>
                  {index < timeline.length - 1 ? (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: step.completed
                            ? theme.success
                            : theme.border,
                        },
                      ]}
                    />
                  ) : null}
                </View>
                <View style={styles.timelineContent}>
                  <ThemedText
                    style={[
                      styles.timelineLabel,
                      !step.completed && { color: theme.textSecondary },
                    ]}
                  >
                    {step.label}
                  </ThemedText>
                  {step.date ? (
                    <ThemedText
                      style={[
                        styles.timelineDate,
                        { color: theme.textSecondary },
                      ]}
                    >
                      {formatDate(step.date)}
                    </ThemedText>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        </View>

        {application.status === "rejected" && application.rejectionReason ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Rejection Reason
            </ThemedText>
            <View
              style={[
                styles.card,
                { backgroundColor: `${theme.error}10` },
              ]}
            >
              <ThemedText style={{ color: theme.error }}>
                {application.rejectionReason}
              </ThemedText>
            </View>
          </View>
        ) : null}

        {application.collegeIdUri ? (
          <View style={styles.section}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Uploaded College ID
            </ThemedText>
            <Image
              source={{ uri: application.collegeIdUri }}
              style={styles.collegeId}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {application.status === "railway_approved" ? (
          <Button onPress={handleDownload} style={styles.downloadButton}>
            Download PDF Pass
          </Button>
        ) : null}
      </KeyboardAwareScrollViewCompat>
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
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  passSection: {
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stationBox: {
    flex: 1,
  },
  stationLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
  },
  arrowContainer: {
    paddingHorizontal: Spacing.md,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
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
    marginBottom: 2,
  },
  gridValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  timelineItem: {
    flexDirection: "row",
    minHeight: 60,
  },
  timelineIndicator: {
    alignItems: "center",
    marginRight: Spacing.md,
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: Spacing.md,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  timelineDate: {
    fontSize: 12,
    marginTop: 2,
  },
  collegeId: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.sm,
  },
  downloadButton: {
    marginTop: Spacing.lg,
  },
});
