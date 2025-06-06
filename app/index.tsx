import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "../assets/theme";
import TapCount from "../components/TapCount";
import { useState } from "react";
import { GlobalStyles as Style } from "@/assets/styles";
import { useRouter } from "expo-router";
import { useSettings } from "./SettingsContext";


// The landing screen, where the measurement of respiratory rate takes place. 
export default function Index() {
  const [tapCount, setTapCount] = useState(0);
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);
  const [rrate, setRRate] = useState(0);
  const [timestamps, setTimestamps] = useState<number[]>([]); // used in calculating the rrate
  const { tapCountRequired, consistencyThreshold } = useSettings();
  const tapLimit = tapCountRequired;
  const consistencyThresholdPercent = consistencyThreshold;

  // handles interactions with the Tap on Inhalation button 
  const consistencyCalculation = () => {
    const now = Date.now() / 1000;
    const updated = [...timestamps, now];
    setTimestamps(updated);

    const result = evaluateRecentTaps({ timestamps: updated });
    if (result) {
      setRRate(result.rate);
      console.log("Consistent rate found:", result.rate);
      router.push("/results");
      return;
    }

    if (updated.length >= 12) {
      // force restart
    }
  };

  function evaluateRecentTaps({ timestamps }: { timestamps: number[] }) {
    if (timestamps.length < tapLimit) return null;

    const recent = timestamps.slice(-tapLimit); // last 5 taps
    const intervals = recent.slice(1).map((t, i) => t - recent[i]);
    const median = getMedian({ arr: intervals });
    const threshold = (consistencyThresholdPercent / 100) * median;

    const isConsistent = intervals.every(
      (interval) => Math.abs(interval - median) <= threshold
    );

    if (isConsistent) {
      return {
        intervals,
        median,
        rate: 60 / median,
      };
    }

    return null;
  }


  function countAndCalculateTap() {
    // update tap count
    if (tapCount < 12) {
      setTapCount(tapCount + 1);
    } else {
      setTapCount(0);
    }

    // perform consistency calculation 
    consistencyCalculation();
  }

  const getMedian = ({ arr }: { arr: number[] }) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };


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
        <Button icon="cog"
          buttonColor={Theme.colors["neutral-bttn"]}
          mode="contained"
          onPress={() => router.push("/settings")}
        >
          Settings
        </Button>
      </View>
      <View style={Style.componentContainer}>
        <TapCount tapCount={tapCount} />
      </View>
      <View style={Style.componentContainer}>
        <Button mode="contained"

          contentStyle={{ width: 350, height: 400 }} labelStyle={{ fontSize: 24, padding: 10 }} onPress={countAndCalculateTap}>
          Tap on Inhalation
        </Button>
        <Button
          buttonColor={Theme.colors["neutral-bttn"]}
          mode="contained"
          onPress={() => router.push("/results")}
        >
          Results
        </Button>
      </View>
    </View >
  );
}
