import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "../assets/theme";
import TapCount from "../components/TapCount";
import { useState } from "react";
import { GlobalStyles as Style } from "@/app/styles";
import { useRouter } from "expo-router";


// The landing screen, where the measurement of respiratory rate takes place. 
export default function Index() {
  const [tapCount, setTapCount] = useState(0);
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={Style.screenContainer}>
      <View style={[Style.componentContainer, { width: 350, flexDirection: 'row', justifyContent: 'space-between', gap: 14 }]}>
        <Button
          mode="contained"
          buttonColor={Theme.colors.tertiary}
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
        <Button icon="cog" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push("/settings")}>
          Settings
        </Button>
      </View>
      <View style={Style.componentContainer}>
        <TapCount tapCount={tapCount} />
      </View>
      <View style={Style.componentContainer}>
        <Button mode="contained"

          contentStyle={{ width: 350, height: 400 }} labelStyle={{ fontSize: 24, padding: 10 }} onPress={() => {
            setTapCount(() => {
              if (tapCount < 12) {
                return tapCount + 1;
              } else {
                return 0;
              }
            })
          }} >
          Tap on Inhalation
        </Button>
        <Button buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push("/results")}>
          Results
        </Button>
      </View>
    </View >
  );
}
