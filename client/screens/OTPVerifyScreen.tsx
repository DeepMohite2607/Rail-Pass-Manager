import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { BorderRadius, Spacing } from "@/constants/theme";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type OTPVerifyScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "OTPVerify">;
  route: RouteProp<AuthStackParamList, "OTPVerify">;
};

const OTP_LENGTH = 6;

export default function OTPVerifyScreen({
  navigation,
  route,
}: OTPVerifyScreenProps) {
  const { phone } = route.params;
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { login, user } = useAuth();
  
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState("");
  
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpString?: string) => {
    const otpValue = otpString || otp.join("");
    if (otpValue.length !== OTP_LENGTH) {
      setError("Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      const success = await login(phone, otpValue);
      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setError("Invalid OTP. Please try again.");
        setOtp(Array(OTP_LENGTH).fill(""));
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      Alert.alert("Error", "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCountdown(30);
    setOtp(Array(OTP_LENGTH).fill(""));
    setError("");
    inputRefs.current[0]?.focus();
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
          <ThemedText type="h1">Verify OTP</ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Enter the 6-digit code sent to +91 {phone}
          </ThemedText>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[
                styles.otpInput,
                {
                  backgroundColor: theme.backgroundDefault,
                  borderColor: error
                    ? theme.error
                    : digit
                    ? theme.primary
                    : theme.border,
                  color: theme.text,
                },
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value.slice(-1), index)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, index)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {error ? (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        ) : null}

        <ThemedText
          style={[styles.hint, { color: theme.textSecondary }]}
        >
          Demo OTP: 123456
        </ThemedText>

        <View style={styles.resendContainer}>
          {countdown > 0 ? (
            <ThemedText style={{ color: theme.textSecondary }}>
              Resend OTP in {countdown}s
            </ThemedText>
          ) : (
            <Pressable onPress={handleResend}>
              <ThemedText style={{ color: theme.primary, fontWeight: "600" }}>
                Resend OTP
              </ThemedText>
            </Pressable>
          )}
        </View>

        <Button
          onPress={() => handleVerify()}
          disabled={otp.some((d) => !d) || loading}
          style={styles.button}
        >
          {loading ? "Verifying..." : "Verify"}
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: BorderRadius.xs,
    borderWidth: 2,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  error: {
    textAlign: "center",
    marginTop: Spacing.md,
    fontSize: 14,
  },
  hint: {
    textAlign: "center",
    marginTop: Spacing.lg,
    fontSize: 12,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  button: {
    marginTop: Spacing["3xl"],
  },
});
