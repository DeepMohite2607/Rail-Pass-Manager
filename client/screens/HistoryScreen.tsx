import React, { useState, useCallback } from "react";
import { FlatList, StyleSheet, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ThemedView } from "@/components/ThemedView";
import { ApplicationCard } from "@/components/ApplicationCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingScreen } from "@/components/LoadingSkeleton";
import { useTheme } from "@/hooks/useTheme";
import { ApplicationStorage } from "@/lib/storage";
import { Spacing } from "@/constants/theme";
import { ConcessionApplication } from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
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

  const handleApplicationPress = (application: ConcessionApplication) => {
    navigation.navigate("ApplicationDetails", { applicationId: application.id });
  };

  const handleApply = () => {
    navigation.navigate("ApplyForm");
  };

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
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ApplicationCard
            application={item}
            onPress={() => handleApplicationPress(item)}
          />
        )}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
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
            image={require("../../assets/images/empty-history.png")}
            title="No Applications Yet"
            description="Your concession application history will appear here"
            actionLabel="Apply Now"
            onAction={handleApply}
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
  emptyContent: {
    flexGrow: 1,
  },
});
