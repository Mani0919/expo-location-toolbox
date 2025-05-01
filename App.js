import { View, Text } from "react-native";
import React from "react";
import GeofencingAsync from "./GeofencingAsync";

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <GeofencingAsync />
    </View>
  );
}
