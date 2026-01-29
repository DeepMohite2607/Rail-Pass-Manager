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
import { useAuth } from "@/context/AuthContext";
import { Spacing } from "@/constants/theme";
import { AuthStackParamList } from "@/navigation/AuthStackNavigator";

type EmailLoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "EmailLogin">;
};

export default function EmailLoginScreen({ navigation }: EmailLoginScreenProps) {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { loginWithEmail, pendingRole } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const isAdminLogin = pendingRole !== "student";

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const success = await loginWithEmail(email, password);
      if (success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert("Error", "Login failed. Please check your credentials.");
      }
    } catch (err) {
      Alert.alert("Error", "Login failed. Please try again.");
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
          <ThemedText type="h1">
            {isAdminLogin ? "Admin Login" : "Email Login"}
          </ThemedText>
          <ThemedText
            style={[styles.subtitle, { color: theme.textSecondary }]}
          >
            {isAdminLogin
              ? "Sign in with your administrative credentials"
              : "Sign in with your college email"}
          </ThemedText>
        </View>

        <View style={styles.form}>
          <Input
            label={isAdminLogin ? "Admin Email" : "College Email"}
            placeholder={
              isAdminLogin ? "admin@college.edu.in" : "student@college.edu.in"
            }
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((e) => ({ ...e, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
            containerStyle={styles.inputContainer}
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors((e) => ({ ...e, password: undefined }));
            }}
            secureTextEntry
            autoComplete="password"
            error={errors.password}
            containerStyle={styles.inputContainer}
          />

          <ThemedText
            style={[styles.hint, { color: theme.textSecondary }]}
          >
            For demo, use any email and password (min 4 characters)
          </ThemedText>
        </View>

        <Button
          onPress={handleLogin}
          disabled={!email || !password || loading}
          style={styles.button}
        >
          {loading ? "Signing in..." : "Sign In"}
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
    gap: Spacing.lg,
  },
  inputContainer: {
    marginBottom: 0,
  },
  hint: {
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    marginTop: Spacing.xl,
  },
});
