import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { Spacing } from "@/constants/theme";

const YEARS = [
  { label: "First Year", value: "1" },
  { label: "Second Year", value: "2" },
  { label: "Third Year", value: "3" },
  { label: "Fourth Year", value: "4" },
];

const DEPARTMENTS = [
  { label: "Computer Science", value: "CS" },
  { label: "Information Technology", value: "IT" },
  { label: "Electronics & Communication", value: "EC" },
  { label: "Mechanical Engineering", value: "ME" },
  { label: "Civil Engineering", value: "CE" },
  { label: "Electrical Engineering", value: "EE" },
  { label: "Chemical Engineering", value: "CH" },
  { label: "Commerce", value: "COM" },
  { label: "Arts", value: "ARTS" },
  { label: "Science", value: "SCI" },
];

export default function ProfileSetupScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [collegeName, setCollegeName] = useState(user?.collegeName || "");
  const [department, setDepartment] = useState(user?.department || "");
  const [year, setYear] = useState(user?.year || "");
  const [prn, setPrn] = useState(user?.prn || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!collegeName.trim()) {
      newErrors.collegeName = "College name is required";
    }
    if (!department) {
      newErrors.department = "Department is required";
    }
    if (!year) {
      newErrors.year = "Year is required";
    }
    if (!prn.trim()) {
      newErrors.prn = "PRN/Roll number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        collegeName: collegeName.trim(),
        department,
        year,
        prn: prn.trim(),
        profileComplete: true,
      });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <ThemedText type="h1">Complete Profile</ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Fill in your student details to apply for railway concession
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name (as per ID)"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              setErrors((e) => ({ ...e, fullName: "" }));
            }}
            autoCapitalize="words"
            error={errors.fullName}
          />

          <Input
            label="College Name"
            placeholder="Enter your college name"
            value={collegeName}
            onChangeText={(text) => {
              setCollegeName(text);
              setErrors((e) => ({ ...e, collegeName: "" }));
            }}
            autoCapitalize="words"
            error={errors.collegeName}
          />

          <Select
            label="Department"
            placeholder="Select your department"
            options={DEPARTMENTS}
            value={department}
            onValueChange={(value) => {
              setDepartment(value);
              setErrors((e) => ({ ...e, department: "" }));
            }}
            error={errors.department}
          />

          <Select
            label="Year of Study"
            placeholder="Select your year"
            options={YEARS}
            value={year}
            onValueChange={(value) => {
              setYear(value);
              setErrors((e) => ({ ...e, year: "" }));
            }}
            error={errors.year}
          />

          <Input
            label="PRN / Roll Number"
            placeholder="Enter your PRN or Roll Number"
            value={prn}
            onChangeText={(text) => {
              setPrn(text);
              setErrors((e) => ({ ...e, prn: "" }));
            }}
            autoCapitalize="characters"
            error={errors.prn}
          />
        </View>

        <Button
          onPress={handleSubmit}
          disabled={loading}
          style={styles.button}
        >
          {loading ? "Saving..." : "Complete Setup"}
        </Button>
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
    flexGrow: 1,
  },
  header: {
    marginBottom: Spacing["2xl"],
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  form: {
    flex: 1,
    gap: Spacing.lg,
  },
  button: {
    marginTop: Spacing.xl,
  },
});
