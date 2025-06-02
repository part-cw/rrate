import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "../assets/theme";



export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <Button
          mode="contained"
          buttonColor={Theme.colors.secondary}
          onPress={() => console.log('Pressed')}
          icon={({ size, color }) => (
            <MaterialCommunityIcons
              name="location-exit"
              size={size}
              color={color}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          )}
        >
          Exit
        </Button>
        <Button icon="cog" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => console.log('Pressed')}>
          Settings
        </Button>
      </View>
    </View >
  );
}
