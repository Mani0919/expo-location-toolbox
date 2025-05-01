import {
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";

const App = () => {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Location Loading....."
  );
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);
  //check if location is enable or not
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync(); //returns true or false
    if (!enabled) {
      //if not enable
      Alert.alert("Location not enabled", "Please enable your Location", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    } else {
      setLocationServicesEnabled(enabled); //store true into state
    }
  };
  //get current location
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync(); //used for the pop up box where we give permission to use location
    console.log(status);
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "Allow the app to use the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ]
      );
    }

    //get current position lat and long
    const { coords } = await Location.getCurrentPositionAsync();
    console.log(coords);

    if (coords) {
      const { latitude, longitude } = coords;
      console.log(latitude, longitude);

      //provide lat and long to get the the actual address
      let responce = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      console.log(responce);
      //loop on the responce to get the actual result
      for (let item of responce) {
        let address = `${item.formattedAddress}`;
        setDisplayCurrentAddress(address);
      }
    }
  };
  const fun = async () => {
    console.log("pressed", lat, long);
    let response = await Location.reverseGeocodeAsync({
      latitude: parseFloat(lat),
      longitude: parseFloat(long),
    });

    console.log(response);
    //loop on the responce to get the actual result
    for (let item of response) {
      let address = `${item.formattedAddress}`;
      setDisplayCurrentAddress(address);
    }
  };
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ alignSelf: "center" }}>{displayCurrentAddress}</Text>
      <TextInput
        value={lat}
        onChangeText={setLat}
        placeholder="enter lalitude"
        style={{
          alignSelf: "center",
          borderColor: "gray",
          borderWidth: 1,
          paddingHorizontal: 40,
          marginVertical: 4,
        }}
      />
      <TextInput
        value={long}
        onChangeText={setLong}
        placeholder="enter longitude"
        style={{
          alignSelf: "center",
          borderColor: "gray",
          borderWidth: 1,
          paddingHorizontal: 40,
          marginVertical: 4,
        }}
      />
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 10,
          borderRadius: 5,
          paddingHorizontal: 4,
          marginVertical: 10,
          alignSelf: "center",
        }}
        onPress={fun}
      >
        <Text style={{ color: "white", paddingHorizontal: 10 }}>Start</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
