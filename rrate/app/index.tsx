import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "../assets/theme";
import TapCount from "../components/TapCount";



export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 14 }}>
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
        <TapCount />

      </View>
      <View style={{ marginTop: 20 }}>
        <Button mode="contained" style={{ paddingTop: 100, paddingBottom: 100 }} onPress={() => console.log('Pressed')} >
          Tap on Inhalation
        </Button>
      </View>
    </View >
  );
}
