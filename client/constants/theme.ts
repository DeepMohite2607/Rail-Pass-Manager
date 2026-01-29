import { Platform } from "react-native";

export const AppColors = {
  primary: "#FF6600",
  primaryDark: "#CC5200",
  secondary: "#1E3A8A",
  background: "#F8F9FA",
  surface: "#FFFFFF",
  border: "#E5E7EB",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  success: "#059669",
  warning: "#F59E0B",
  error: "#DC2626",
  pending: "#3B82F6",
};

const tintColorLight = AppColors.primary;
const tintColorDark = "#FF8533";

export const Colors = {
  light: {
    text: AppColors.textPrimary,
    textSecondary: AppColors.textSecondary,
    buttonText: "#FFFFFF",
    tabIconDefault: AppColors.textSecondary,
    tabIconSelected: tintColorLight,
    link: AppColors.primary,
    primary: AppColors.primary,
    primaryDark: AppColors.primaryDark,
    secondary: AppColors.secondary,
    success: AppColors.success,
    warning: AppColors.warning,
    error: AppColors.error,
    pending: AppColors.pending,
    border: AppColors.border,
    backgroundRoot: AppColors.background,
    backgroundDefault: AppColors.surface,
    backgroundSecondary: "#F3F4F6",
    backgroundTertiary: "#E5E7EB",
  },
  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    buttonText: "#FFFFFF",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    link: tintColorDark,
    primary: tintColorDark,
    primaryDark: "#CC5200",
    secondary: "#3B82F6",
    success: "#10B981",
    warning: "#FBBF24",
    error: "#EF4444",
    pending: "#60A5FA",
    border: "#374151",
    backgroundRoot: "#111827",
    backgroundDefault: "#1F2937",
    backgroundSecondary: "#374151",
    backgroundTertiary: "#4B5563",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
