import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "@/screens/LoginScreen";
import PhoneEntryScreen from "@/screens/PhoneEntryScreen";
import OTPVerifyScreen from "@/screens/OTPVerifyScreen";
import EmailLoginScreen from "@/screens/EmailLoginScreen";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type AuthStackParamList = {
  Login: undefined;
  PhoneEntry: undefined;
  OTPVerify: { phone: string };
  EmailLogin: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PhoneEntry"
        component={PhoneEntryScreen}
        options={{ headerTitle: "Mobile Login" }}
      />
      <Stack.Screen
        name="OTPVerify"
        component={OTPVerifyScreen}
        options={{ headerTitle: "Verify OTP" }}
      />
      <Stack.Screen
        name="EmailLogin"
        component={EmailLoginScreen}
        options={{ headerTitle: "Email Login" }}
      />
    </Stack.Navigator>
  );
}
