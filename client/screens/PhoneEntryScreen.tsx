import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { Spacing } from "@/constants/theme";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type PhoneEntryScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "PhoneEntry">;
};

export default function PhoneEntryScreen({ navigation }: PhoneEntryScreenProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 10) return;
    setPhone(cleaned);
    setError("");
  };

  const handleSendOTP = async () => {
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigation.navigate("OTPVerify", { phone });
    } catch (err) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
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
            paddingTop: headerHeight + Spacing["3xl"],
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.header}>
          <ThemedText type="h1">Enter Mobile Number</ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            We'll send you a one-time verification code
          </ThemedText>
        </View>

        <View style={styles.form}>
          <View style={styles.phoneInputContainer}>
            <View
              style={[
                styles.countryCode,
                { backgroundColor: theme.backgroundSecondary },
              ]}
            >
              <ThemedText style={styles.countryCodeText}>+91</ThemedText>
            </View>
            <Input
              placeholder="Enter 10-digit number"
              value={phone}
              onChangeText={validatePhone}
              keyboardType="phone-pad"
              maxLength={10}
              error={error}
              containerStyle={styles.phoneInput}
              autoFocus
            />
          </View>

          <ThemedText
            style={[styles.hint, { color: theme.textSecondary }]}
          >
            For demo, use OTP: 123456
          </ThemedText>
        </View>

        <Button
          onPress={handleSendOTP}
          disabled={phone.length !== 10 || loading}
          style={styles.button}
        >
          {loading ? "Sending..." : "Send OTP"}
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
    marginBottom: Spacing["3xl"],
  },
  subtitle: {
    marginTop: Spacing.sm,
  },
  form: {
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  countryCode: {
    height: 48,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
  },
  hint: {
    fontSize: 12,
    marginTop: Spacing.md,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.xl,
  },
});
