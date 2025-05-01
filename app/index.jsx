import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

export default function index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        style={{
          backgroundColor: "blue",
          padding: 10,
          borderRadius: 5,
          paddingHorizontal: 4,
          marginVertical: 10,
        }}
        onPress={() => router.push("/speed")}
      >
        <Text style={{ color: "white" }}>Test Speed of the Device</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "green",
          padding: 10,
          borderRadius: 5,
          paddingHorizontal: 4,
          marginVertical: 10,
        }}
        onPress={() => router.push("/backgroundTracking")}
      >
        <Text style={{ color: "white", paddingHorizontal: 10 }}>
          background tarcking
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 10,
          borderRadius: 5,
          paddingHorizontal: 4,
          marginVertical: 10,
        }}
        onPress={() => router.push("/getAddress")}
      >
        <Text style={{ color: "white", paddingHorizontal: 10 }}>
          Get Address with cordinates
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: "orange",
          padding: 10,
          borderRadius: 5,
          paddingHorizontal: 4,
          marginVertical: 10,
        }}
        onPress={() => router.push("/geoFenching")}
      >
        <Text style={{ color: "white", paddingHorizontal: 10 }}>
          Geo Fenching
        </Text>
      </TouchableOpacity>
    </View>
  );
}
