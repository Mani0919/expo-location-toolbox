import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCATION_TASK_NAME = "background-location-task";
const SPEED_STORAGE_KEY = "latest_speed";

let speedWindow = [];
const WINDOW_SIZE = 5;

export default function App() {
  const [speed, setSpeed] = useState("0.00");

  useEffect(() => {
    const startLocationTracking = async () => {
      const { status: fgStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        console.warn("Foreground location permission denied");
        return;
      }

      const { status: bgStatus } =
        await Location.requestBackgroundPermissionsAsync();
      if (bgStatus !== "granted") {
        console.warn("Background location permission denied");
        return;
      }

      const hasStarted = await Location.hasStartedLocationUpdatesAsync(
        LOCATION_TASK_NAME
      );
      if (!hasStarted) {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Tracking Speed",
            notificationBody: "App is monitoring your speed in the background.",
          },
        });
      }
    };

    // Polling AsyncStorage every second to update UI
    const interval = setInterval(async () => {
      const storedSpeed = await AsyncStorage.getItem(SPEED_STORAGE_KEY);
      if (storedSpeed) {
        setSpeed(storedSpeed);
      }
    }, 1000);

    startLocationTracking();

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Your Speed</Text>
      <Text style={styles.speed}>{speed} km/h</Text>
    </View>
  );
}

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }

  if (data) {
    const { locations } = data;
    const location = locations[0];
    const speed = location?.coords?.speed;

    if (speed != null && speed >= 0) {
      speedWindow.push(speed);
      if (speedWindow.length > WINDOW_SIZE) {
        speedWindow.shift();
      }

      const avgSpeed =
        speedWindow.reduce((sum, val) => sum + val, 0) / speedWindow.length;

      const speedInKmH = (avgSpeed * 3.6).toFixed(2);

      console.log("Smoothed Speed:", speedInKmH);
      await AsyncStorage.setItem(SPEED_STORAGE_KEY, speedInKmH.toString());
    }
  }
});

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 24, marginBottom: 10 },
  speed: { fontSize: 40, fontWeight: "bold", color: "blue" },
});
