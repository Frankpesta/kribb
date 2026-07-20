import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaView>
      <View>
        <Text>Welcome to Day One of the Rest of my Life.</Text>
      </View>
    </SafeAreaView>
  );
}
