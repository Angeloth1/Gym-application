import { supabase } from "@/lib/supabase";
import { Text, View } from "react-native";

export default function Index() {
  console.log(supabase);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hello World!</Text>
    </View>
  );

}
