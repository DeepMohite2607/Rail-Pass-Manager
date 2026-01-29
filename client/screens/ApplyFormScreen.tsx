import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Pressable, Image, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { v4 as uuidv4 } from "uuid";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Select } from "@/components/Select";
import { SegmentedControl } from "@/components/SegmentedControl";
import { Button } from "@/components/Button";
import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/context/AuthContext";
import { ApplicationStorage } from "@/lib/storage";
import { Spacing, BorderRadius } from "@/constants/theme";
import {
  ConcessionApplication,
  TravelClass,
  Duration,
  INDIAN_RAILWAY_STATIONS,
} from "@/types";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

const stationOptions = INDIAN_RAILWAY_STATIONS.map((s) => ({
  label: `${s.name} (${s.code})`,
  value: s.code,
}));

const classOptions: { label: string; value: TravelClass }[] = [
  { label: "Second Class", value: "2nd" },
  { label: "First Class", value: "1st" },
];

const durationOptions: { label: string; value: Duration }[] = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
];

export default function ApplyFormScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [sourceStation, setSourceStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [travelClass, setTravelClass] = useState<TravelClass>("2nd");
  const [duration, setDuration] = useState<Duration>("monthly");
  const [collegeIdUri, setCollegeIdUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadDraft();
  }, []);

  const loadDraft = async () => {
    try {
      const draft = await ApplicationStorage.getDraft();
      if (draft) {
        if (draft.sourceStation) setSourceStation(draft.sourceStation);
        if (draft.destinationStation) setDestinationStation(draft.destinationStation);
        if (draft.travelClass) setTravelClass(draft.travelClass);
        if (draft.duration) setDuration(draft.duration);
        if (draft.collegeIdUri) setCollegeIdUri(draft.collegeIdUri);
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  };

  const saveDraft = async () => {
    try {
      await ApplicationStorage.saveDraft({
        sourceStation,
        destinationStation,
        travelClass,
        duration,
        collegeIdUri: collegeIdUri || undefined,
      });
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  useEffect(() => {
    saveDraft();
  }, [sourceStation, destinationStation, travelClass, duration, collegeIdUri]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to upload your college ID."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCollegeIdUri(result.assets[0].uri);
      setErrors((e) => ({ ...e, collegeId: "" }));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera access to take a photo of your college ID."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCollegeIdUri(result.assets[0].uri);
      setErrors((e) => ({ ...e, collegeId: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!sourceStation) {
      newErrors.source = "Please select source station";
    }
    if (!destinationStation) {
      newErrors.destination = "Please select destination station";
    }
    if (sourceStation && destinationStation && sourceStation === destinationStation) {
      newErrors.destination = "Source and destination must be different";
    }
    if (!collegeIdUri) {
      newErrors.collegeId = "Please upload your college ID";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    if (!user) return;

    setLoading(true);
    try {
      const now = new Date();
      const validFrom = now.toISOString();
      const validTo = new Date(
        now.getTime() + (duration === "monthly" ? 30 : 90) * 24 * 60 * 60 * 1000
      ).toISOString();

      const application: ConcessionApplication = {
        id: uuidv4(),
        userId: user.id,
        studentName: user.fullName,
        collegeName: user.collegeName || "",
        department: user.department || "",
        year: user.year || "",
        prn: user.prn || "",
        sourceStation,
        destinationStation,
        travelClass,
        duration,
        reason: "Academic Travel",
        collegeIdUri: collegeIdUri || undefined,
        status: "submitted",
        validFrom,
        validTo,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };

      await ApplicationStorage.addApplication(application);
      await ApplicationStorage.clearDraft();

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        "Application Submitted",
        "Your concession application has been submitted successfully. You can track its status in the History tab.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit application. Please try again.");
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
        <ThemedText type="h3" style={styles.sectionTitle}>
          Journey Details
        </ThemedText>

        <Select
          label="Source Station"
          placeholder="Select departure station"
          options={stationOptions}
          value={sourceStation}
          onValueChange={(value) => {
            setSourceStation(value);
            setErrors((e) => ({ ...e, source: "" }));
          }}
          error={errors.source}
          containerStyle={styles.inputContainer}
        />

        <Select
          label="Destination Station"
          placeholder="Select arrival station"
          options={stationOptions}
          value={destinationStation}
          onValueChange={(value) => {
            setDestinationStation(value);
            setErrors((e) => ({ ...e, destination: "" }));
          }}
          error={errors.destination}
          containerStyle={styles.inputContainer}
        />

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Travel Class</ThemedText>
          <SegmentedControl
            options={classOptions}
            value={travelClass}
            onChange={setTravelClass}
          />
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Duration</ThemedText>
          <SegmentedControl
            options={durationOptions}
            value={duration}
            onChange={setDuration}
          />
        </View>

        <ThemedText type="h3" style={[styles.sectionTitle, styles.uploadSection]}>
          College ID
        </ThemedText>

        {collegeIdUri ? (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: collegeIdUri }}
              style={styles.preview}
              resizeMode="cover"
            />
            <Pressable
              onPress={() => setCollegeIdUri(null)}
              style={[styles.removeButton, { backgroundColor: theme.error }]}
            >
              <Feather name="x" size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <Pressable
              onPress={takePhoto}
              style={[
                styles.uploadButton,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
              ]}
            >
              <Feather name="camera" size={24} color={theme.primary} />
              <ThemedText style={styles.uploadButtonText}>Take Photo</ThemedText>
            </Pressable>

            <Pressable
              onPress={pickImage}
              style={[
                styles.uploadButton,
                { backgroundColor: theme.backgroundDefault, borderColor: theme.border },
              ]}
            >
              <Feather name="image" size={24} color={theme.primary} />
              <ThemedText style={styles.uploadButtonText}>From Gallery</ThemedText>
            </Pressable>
          </View>
        )}
        {errors.collegeId ? (
          <ThemedText style={[styles.error, { color: theme.error }]}>
            {errors.collegeId}
          </ThemedText>
        ) : null}

        <Button
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? "Submitting..." : "Submit Application"}
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
  },
  sectionTitle: {
    marginBottom: Spacing.lg,
  },
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: Spacing.sm,
  },
  uploadSection: {
    marginTop: Spacing.xl,
  },
  uploadOptions: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  uploadButton: {
    flex: 1,
    height: 100,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  previewContainer: {
    position: "relative",
  },
  preview: {
    width: "100%",
    height: 200,
    borderRadius: BorderRadius.sm,
  },
  removeButton: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  submitButton: {
    marginTop: Spacing["3xl"],
  },
});
