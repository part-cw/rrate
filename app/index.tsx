import { View } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Theme } from "../assets/theme";
import TapCount from "../components/TapCount";
import { useState, useEffect, useRef } from "react";
import { GlobalStyles as Style } from "@/assets/styles";
import { useRouter } from "expo-router";
import { useSettings } from "./globalContext";
import AlertModal from "../components/alertModal";

// The landing screen, where the measurement of respiratory rate takes place. 
export default function Index() {
  const router = useRouter();

  const [tapCount, setTapCount] = useState(0);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [tapsTooFastModalVisible, setTapsTooFastModalVisible] = useState<boolean>(false);
  const [notEnoughTapsModalVisible, setNotEnoughTapsModalVisible] = useState<boolean>(false);
  const [tapsInconsistentModalVisible, setTapsInconsistentModalVisible] = useState<boolean>(false);
  const { tapCountRequired, consistencyThreshold, setRRate, setTapTimestaps } = useSettings();

  const tapLimit = tapCountRequired;
  const consistencyThresholdPercent = consistencyThreshold;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notEnoughTapsVisibleRef = useRef(false); // reference for the modal to prevent multiple openings due to asynchronous state updates


  const tapsTooFast = () => setTapsTooFastModalVisible(true);
  const notEnoughTaps = () => {
    if (!notEnoughTapsModalVisible) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      setNotEnoughTapsModalVisible(true);
    }
  };

  const inconsistentTaps = () => setTapsInconsistentModalVisible(true);

  // Updates the reference for whether the Not Enough Taps modal is visible
  useEffect(() => {
    notEnoughTapsVisibleRef.current = notEnoughTapsModalVisible;
  }, [notEnoughTapsModalVisible]);

  // Sets up a timeout to trigger the Not Enough Taps modal if no taps are recorded within 60 seconds
  useFocusEffect(
    useCallback(() => {
      if (timestamps.length === 0 || notEnoughTapsModalVisible) return;

      // Set the timeout
      timeoutRef.current = setTimeout(() => {
        if (!notEnoughTapsModalVisible) {
          notEnoughTaps();
        }
      }, 60000);

      // Cleanup when screen is unfocused or timestamps change
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [timestamps, notEnoughTapsModalVisible])
  );


  // Handler function triggered by the Tap on Inhalation button. 
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

  // calculates consistency of taps
  const consistencyCalculation = () => {
    const now = Date.now() / 1000;
    const updated = [...timestamps, now];
    setTimestamps(updated);

    const result = evaluateRecentTaps({ timestamps: updated });

    if (result) {
      setRRate(Math.round(result.rate)); // set the respiratory rate in the global context so it can be used in other components
      setTapTimestaps(updated); // store timestamps in the global context
      if (result.rate < 140) {

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        router.push("/results");
        return;
      } else {
        tapsTooFast();
        return;
      }
    }

    if (updated.length >= 12) {
      inconsistentTaps();
    }
  };

  // Checks if the last few taps were consistent and calculates rrate (required tap count determined in Settings; default is 5)
  function evaluateRecentTaps({ timestamps }: { timestamps: number[] }) {
    if (timestamps.length < tapLimit) return null;

    const recent = timestamps.slice(-tapLimit);
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

  // Returns the median of an array of numbers
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
        <Button
          icon="cog"
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
        <Button
          mode="contained"
          contentStyle={{ width: 350, height: 400 }}
          labelStyle={{ fontSize: 24, padding: 10 }}
          onPress={countAndCalculateTap}
        >
          Tap on Inhalation
        </Button>
      </View>

      <AlertModal isVisible={tapsTooFastModalVisible} message={"Taps are too fast."} onClose={() => setTapsTooFastModalVisible(false)} />
      <AlertModal isVisible={notEnoughTapsModalVisible} message={"Not enough taps in 60 seconds."} onClose={() => {
        setNotEnoughTapsModalVisible(false);
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current);
        }
      }} />
      <AlertModal isVisible={tapsInconsistentModalVisible} message={"Taps are inconsistent."} onClose={() => setTapsInconsistentModalVisible(false)} />
    </View>
  );
}
