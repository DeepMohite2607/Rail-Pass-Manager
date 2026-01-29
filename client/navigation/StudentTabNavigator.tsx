import React from "react";
import { Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import StudentHomeScreen from "@/screens/StudentHomeScreen";
import HistoryScreen from "@/screens/HistoryScreen";
import StudentProfileScreen from "@/screens/StudentProfileScreen";
import { HeaderTitle } from "@/components/HeaderTitle";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { useScreenOptions } from "@/hooks/useScreenOptions";

export type StudentTabParamList = {
  HomeTab: undefined;
  HistoryTab: undefined;
  ProfileTab: undefined;
};

type HomeStackParamList = {
  Home: undefined;
};

type HistoryStackParamList = {
  History: undefined;
};

type ProfileStackParamList = {
  Profile: undefined;
};

const Tab = createBottomTabNavigator<StudentTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HistoryStack = createNativeStackNavigator<HistoryStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

function HomeStackNavigator() {
  const screenOptions = useScreenOptions();
  const { user } = useAuth();

  return (
    <HomeStack.Navigator screenOptions={screenOptions}>
      <HomeStack.Screen
        name="Home"
        component={StudentHomeScreen}
        options={{
          headerTitle: () => (
            <HeaderTitle title={user?.collegeName || "Rail Concession"} />
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}

function HistoryStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <HistoryStack.Navigator screenOptions={screenOptions}>
      <HistoryStack.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerTitle: "History" }}
      />
    </HistoryStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const screenOptions = useScreenOptions();

  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen
        name="Profile"
        component={StudentProfileScreen}
        options={{ headerTitle: "Profile" }}
      />
    </ProfileStack.Navigator>
  );
}

export default function StudentTabNavigator() {
  const { theme, isDark } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.select({
            ios: "transparent",
            android: theme.backgroundRoot,
          }),
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={100}
              tint={isDark ? "dark" : "light"}
              style={StyleSheet.absoluteFill}
            />
          ) : null,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryStackNavigator}
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Feather name="file-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
