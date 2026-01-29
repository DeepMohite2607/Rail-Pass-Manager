import React, { forwardRef } from "react";
import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, containerStyle, style, ...props }, ref) => {
    const { theme, isDark } = useTheme();

    return (
      <View style={containerStyle}>
        {label ? (
          <ThemedText style={styles.label}>{label}</ThemedText>
        ) : null}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundDefault,
              color: theme.text,
              borderColor: error ? theme.error : theme.border,
            },
            style,
          ]}
          placeholderTextColor={theme.textSecondary}
          {...props}
        />
        {error ? (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {error}
          </ThemedText>
        ) : null}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  input: {
    height: Spacing.inputHeight,
    borderRadius: BorderRadius.xs,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
});
