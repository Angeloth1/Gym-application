import { View } from "react-native";
import { Button, Text } from "react-native-paper";

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text variant="headlineMedium">Welcome to the Gym App!</Text>
      <Button mode="contained" onPress={() => alert("Get Started!")}>
        Get Started
      </Button>
    </View>
  );
}