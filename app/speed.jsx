import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [speed, setSpeed] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          if (location?.coords?.speed != null) {
            // console.log(location.coords.speed);
            setSpeed(location.coords.speed);
          }
        }
      );
    })();
  }, []);

  const speedInKmph = speed ? speed * 3.6 : 0;
  const displaySpeed = speedInKmph > 1 ? speedInKmph.toFixed(2) : "0.00";

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Speed: {displaySpeed} km/h</Text>
      {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24 },
  error: { color: "red", marginTop: 10 },
});
