import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthStackNavigator from "@/navigation/AuthStackNavigator";
import StudentTabNavigator from "@/navigation/StudentTabNavigator";
import ProfileSetupScreen from "@/screens/ProfileSetupScreen";
import ApplyFormScreen from "@/screens/ApplyFormScreen";
import ApplicationDetailsScreen from "@/screens/ApplicationDetailsScreen";
import AdminDashboardScreen from "@/screens/AdminDashboardScreen";
import { useAuth } from "@/context/AuthContext";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type RootStackParamList = {
  Auth: undefined;
  ProfileSetup: undefined;
  StudentMain: undefined;
  AdminDashboard: undefined;
  ApplyForm: undefined;
  ApplicationDetails: { applicationId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const screenOptions = useScreenOptions();

  if (isLoading) {
    return null;
  }

  const needsProfileSetup =
    isAuthenticated &&
    user?.role === "student" &&
    !user.profileComplete;

  const isAdmin =
    isAuthenticated &&
    (user?.role === "college_admin" || user?.role === "railway_admin");

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthStackNavigator}
          options={{ headerShown: false }}
        />
      ) : needsProfileSetup ? (
        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetupScreen}
          options={{ headerTitle: "Complete Profile", headerBackVisible: false }}
        />
      ) : isAdmin ? (
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{ headerShown: false }}
        />
      ) : (
        <>
          <Stack.Screen
            name="StudentMain"
            component={StudentTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ApplyForm"
            component={ApplyFormScreen}
            options={{ headerTitle: "New Application" }}
          />
          <Stack.Screen
            name="ApplicationDetails"
            component={ApplicationDetailsScreen}
            options={{ headerTitle: "Application Details" }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
