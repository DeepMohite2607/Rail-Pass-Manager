import React from "react";
import { View, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing, BorderRadius } from "@/constants/theme";

export default function StudentProfileScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await Haptics.notificationAsync(
              Haptics.NotificationFeedbackType.Success
            );
            await logout();
          },
        },
      ]
    );
  };

  const profileItems = [
    {
      icon: "user" as const,
      label: "Full Name",
      value: user?.fullName || "Not set",
    },
    {
      icon: "book" as const,
      label: "College",
      value: user?.collegeName || "Not set",
    },
    {
      icon: "briefcase" as const,
      label: "Department",
      value: user?.department || "Not set",
    },
    {
      icon: "calendar" as const,
      label: "Year",
      value: user?.year ? `Year ${user.year}` : "Not set",
    },
    {
      icon: "hash" as const,
      label: "PRN / Roll No",
      value: user?.prn || "Not set",
    },
    {
      icon: "phone" as const,
      label: "Mobile",
      value: user?.phone ? `+91 ${user.phone}` : "Not set",
    },
    {
      icon: "mail" as const,
      label: "Email",
      value: user?.email || "Not set",
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: headerHeight + Spacing.xl,
            paddingBottom: tabBarHeight + Spacing.xl,
          },
        ]}
        scrollIndicatorInsets={{ bottom: insets.bottom }}
      >
        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            <Image
              source={require("../../assets/images/avatar-default.png")}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <ThemedText type="h2" style={styles.name}>
            {user?.fullName || "Student"}
          </ThemedText>
          <ThemedText style={[styles.role, { color: theme.textSecondary }]}>
            Student
          </ThemedText>
        </View>

        <View style={styles.section}>
          <ThemedText type="h4" style={styles.sectionTitle}>
            Student Details
          </ThemedText>
          <View
            style={[
              styles.detailsCard,
              { backgroundColor: theme.backgroundDefault },
            ]}
          >
            {profileItems.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.detailRow,
                  index < profileItems.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View style={styles.detailIconContainer}>
                  <Feather name={item.icon} size={18} color={theme.primary} />
                </View>
                <View style={styles.detailContent}>
                  <ThemedText
                    style={[styles.detailLabel, { color: theme.textSecondary }]}
                  >
                    {item.label}
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {item.value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <Pressable
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            { backgroundColor: `${theme.error}15` },
          ]}
        >
          <Feather name="log-out" size={20} color={theme.error} />
          <ThemedText style={[styles.logoutText, { color: theme.error }]}>
            Logout
          </ThemedText>
        </Pressable>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.lg,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: Spacing["2xl"],
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  name: {
    marginTop: Spacing.md,
  },
  role: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  detailsCard: {
    borderRadius: BorderRadius.sm,
    overflow: "hidden",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
