import React from "react";
import { View, Image, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/Button";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { BorderRadius, Spacing, Shadows } from "@/constants/theme";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Login">;
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const { setUserRole } = useAuth();

  const handleMobileLogin = () => {
    setUserRole("student");
    navigation.navigate("PhoneEntry");
  };

  const handleEmailLogin = () => {
    setUserRole("student");
    navigation.navigate("EmailLogin");
  };

  const handleAdminLogin = () => {
    setUserRole("college_admin");
    navigation.navigate("EmailLogin");
  };

  return (
    <ThemedView style={styles.container}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + Spacing["3xl"],
            paddingBottom: insets.bottom + Spacing.xl,
          },
        ]}
      >
        <View style={styles.illustrationContainer}>
          <Image
            source={require("../../assets/images/login-illustration.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.logoContainer}>
            <View style={[styles.logo, { backgroundColor: theme.primary }]}>
              <Feather name="navigation" size={32} color="#FFFFFF" />
            </View>
          </View>

          <ThemedText type="h1" style={styles.title}>
            Rail Concession
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            Digital railway concession for college students across India
          </ThemedText>

          <View style={styles.buttonContainer}>
            <Button onPress={handleMobileLogin} style={styles.primaryButton}>
              Continue with Mobile OTP
            </Button>

            <Pressable
              onPress={handleEmailLogin}
              style={[
                styles.secondaryButton,
                { borderColor: theme.border },
              ]}
            >
              <Feather name="mail" size={20} color={theme.text} />
              <ThemedText style={styles.secondaryButtonText}>
                College Email Login
              </ThemedText>
            </Pressable>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]}>
            <ThemedText
              style={[
                styles.dividerText,
                { color: theme.textSecondary, backgroundColor: theme.backgroundRoot },
              ]}
            >
              OR
            </ThemedText>
          </View>

          <Pressable
            onPress={handleAdminLogin}
            style={styles.adminLink}
          >
            <ThemedText style={[styles.adminLinkText, { color: theme.primary }]}>
              Admin / Authority Login
            </ThemedText>
            <Feather name="arrow-right" size={16} color={theme.primary} />
          </Pressable>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 180,
  },
  illustration: {
    width: "100%",
    height: 180,
  },
  card: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: Spacing.lg,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  title: {
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: Spacing["2xl"],
    paddingHorizontal: Spacing.lg,
  },
  buttonContainer: {
    width: "100%",
    gap: Spacing.md,
  },
  primaryButton: {
    width: "100%",
  },
  secondaryButton: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: Spacing.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  dividerText: {
    paddingHorizontal: Spacing.lg,
    fontSize: 12,
    position: "absolute",
  },
  adminLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
  },
  adminLinkText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
