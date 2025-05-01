import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const GEOFENCE_TASK = "geofence-task";

// 1. Define the geofence task
TaskManager.defineTask(
  GEOFENCE_TASK,
  ({ data: { eventType, region }, error }) => {
    if (error) {
      console.error("Geofencing Error", error);
      return;
    }

    if (eventType === Location.GeofencingEventType.Enter) {
      console.log(`🏠 Entered region: ${region.identifier}`);
      Alert.alert("Geofence", `Entered ${region.identifier}`);
    } else if (eventType === Location.GeofencingEventType.Exit) {
      console.log(`🚪 Exited region: ${region.identifier}`);
      Alert.alert("Geofence", `Exited ${region.identifier}`);
    }
  }
);

export default function GeofencingAsync() {
  const region = {
    identifier: "MyLocation",
    latitude: 17.385044, // Replace with your target latitude
    longitude: 78.486671, // Replace with your target longitude
    radius: 200, // meters
    notifyOnEnter: true,
    notifyOnExit: true,
  };

  const startGeofencing = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }

    const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
    if (!started) {
      await Location.startGeofencingAsync(GEOFENCE_TASK, [region]);
      Alert.alert("Geofencing", "Geofence started.");
    } else {
      Alert.alert("Geofencing", "Already running.");
    }
  };

  const stopGeofencing = async () => {
    const started = await Location.hasStartedGeofencingAsync(GEOFENCE_TASK);
    if (started) {
      await Location.stopGeofencingAsync(GEOFENCE_TASK);
      Alert.alert("Geofencing", "Geofence stopped.");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={startGeofencing}>
        <Text style={styles.buttonText}>Start Geofencing</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={stopGeofencing}
      >
        <Text style={styles.buttonText}>Stop Geofencing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: { color: "white", fontSize: 18 },
});
