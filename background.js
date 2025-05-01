import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  DeviceEventEmitter,
} from "react-native";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TRACKING = "location-tracking";

var l1;
var l2;

function App() {
  const [locationStarted, setLocationStarted] = React.useState(false);
  const [locationdata, setLocationData] = useState("");

  const startLocationTracking = async () => {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      distanceInterval: 0,
      foregroundService: {
        notificationTitle: "Tracking Speed",
        notificationBody: "App is monitoring your speed in the background.",
      },
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    setLocationStarted(hasStarted);
    console.log("tracking started?", hasStarted);
  };

  React.useEffect(() => {
    const config = async () => {
      let resf = await Location.requestForegroundPermissionsAsync();
      let resb = await Location.requestBackgroundPermissionsAsync();
      if (resf.status != "granted" && resb.status !== "granted") {
        console.log("Permission to access location was denied");
      } else {
        console.log("Permission to access location granted");
      }
    };

    config();
  }, []);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "locationSpeed",
      (speed) => {
        setLocationData(`${(speed * 3.6).toFixed(2)} km/h`);
      }
    );

    return () => subscription.remove(); // cleanup on unmount
  }, []);

  const startLocation = () => {
    startLocationTracking();
  };

  const stopLocation = () => {
    setLocationStarted(false);
    TaskManager.isTaskRegisteredAsync(LOCATION_TRACKING).then((tracking) => {
      if (tracking) {
        Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
    });
  };
  console.log(locationStarted);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      {locationStarted ? (
        <TouchableOpacity onPress={stopLocation}>
          <Text style={styles.btnText}>Stop Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={startLocation}>
          <Text style={styles.btnText}>Start Tracking</Text>
        </TouchableOpacity>
      )}
      <Text style={{ fontSize: 30, alignSelf: "center", marginVertical: 10 }}>
        Speed-{locationdata}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  btnText: {
    fontSize: 20,
    backgroundColor: "green",
    color: "white",
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center",
  },
});

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    let lat = locations[0].coords.latitude;
    let long = locations[0].coords.longitude;
    let speed = locations[0].coords.speed;
    DeviceEventEmitter.emit("locationSpeed", speed);
    l1 = lat;
    l2 = long;

    console.log(
      `${new Date(Date.now()).toLocaleString()}: ${lat},${long},${speed}`
    );
  }
});

export default App;
