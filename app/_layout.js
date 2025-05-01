import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="speed" />
      <Stack.Screen name="backgroundTracking" />
      <Stack.Screen name="getAddress" />
    </Stack>
  );
}
