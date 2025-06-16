import { View, Text, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Theme } from "../assets/theme";
import TapCount from "../components/TapCount";
import { useState, useEffect, useRef } from "react";
import { GlobalStyles as Style } from "@/assets/styles";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "./globalContext";
import AlertModal from "../components/alertModal";
import useTranslation from '@/hooks/useTranslation';
import { evaluateRecentTaps } from '../utils/consistencyFunctions';
import Timer from '../components/timer';

// The landing screen, where the measurement of respiratory rate takes place. 
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation(); // use the function to get translations; pass in the keyword 

  // LOCAL VARIABLES
  const [tapCount, setTapCount] = useState(0);
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [tapsTooFastModalVisible, setTapsTooFastModalVisible] = useState<boolean>(false);
  const [notEnoughTapsModalVisible, setNotEnoughTapsModalVisible] = useState<boolean>(false);
  const [tapsInconsistentModalVisible, setTapsInconsistentModalVisible] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false); // Tap on Inhalation button state
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // GLOBAL VARIABLES
  const { tapCountRequired, consistencyThreshold, setRRate, setTapTimestaps, measurementMethod } = useGlobalVariables();

  // REFS (stores mutable values that do not cause re-renders when changed)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notEnoughTapsVisibleRef = useRef(false); // reference for the modal to prevent multiple openings due to asynchronous state updates
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const tapCountRef = useRef(0);

  // MODAL DIALOG PAGE LOGIC
  const tapsTooFast = () => setTapsTooFastModalVisible(true);

  const inconsistentTaps = () => setTapsInconsistentModalVisible(true);

  const notEnoughTaps = () => {
    if (!notEnoughTapsModalVisible) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      setNotEnoughTapsModalVisible(true);
    }
  };

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
        if (!notEnoughTapsModalVisible && measurementMethod === 'tap') {
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

  // Start timer when first tap occurs; only if measurement method is 'tap for one minute'
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev >= 59) {
          clearInterval(intervalRef.current!);

          setRRate(tapCountRef.current);
          setTapTimestaps(timestamps);
          router.push("/results");

          return 60;
        }
        return prev + 1;
      });
    }, 1000);
  };

  // Cleanup timer interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  // Handler function triggered by the Tap on Inhalation button
  function countAndCalculateTap() {
    const now = Date.now() / 1000;
    tapCountRef.current += 1;
    setTapCount(tapCountRef.current)

    if (measurementMethod === 'timer') {
      // Start timer only on first tap
      if (!timerRunning) {
        startTimer();
        setTimerRunning(true);
      }

      setTimestamps(prev => [...prev, now]);
    } else if (measurementMethod === 'tap') {
      // Assess the consistency of taps to determine whether to proceed to results page
      consistencyCalculation();
    }
  }

  // calculates consistency of taps
  const consistencyCalculation = () => {
    const now = Date.now() / 1000;
    const updated = [...timestamps, now];
    setTimestamps(updated);

    const result = evaluateRecentTaps({ timestamps: updated, tapCountRequired, consistencyThreshold });

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

  return (
    <ScrollView contentContainerStyle={{
      margin: 30, paddingTop: 30, flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View>
        <View style={[Style.componentContainer, { flexDirection: 'row', justifyContent: 'space-between', gap: 14 }]}>
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
            <Text>{t("EXIT")}</Text>
          </Button>
          <Button
            icon="cog"
            buttonColor={Theme.colors["neutral-bttn"]}
            mode="contained"
            onPress={() => router.push("/settings")}
          >
            <Text>{t("SETTINGS")}</Text>
          </Button>
        </View>

        <View style={Style.componentContainer}>
          {measurementMethod === 'tap' ?
            <TapCount tapCount={tapCount} /> : <Timer time={time} />
          }
        </View>

        <View style={[Style.componentContainer, { width: '100%', maxWidth: 350 }]}>
          <Button
            mode="contained"
            contentStyle={{ height: 500, backgroundColor: isPressed ? Theme.colors.buttonPressed : Theme.colors.primary }}
            labelStyle={{ fontSize: 24, padding: 10 }}
            onPressIn={() => setIsPressed(true)}   // when button is pressed
            onPressOut={() => setIsPressed(false)} // when button is released
            onPress={countAndCalculateTap}
          >
            <Text>{t("TAP_INHALATION")}</Text>
          </Button>
        </View>

        <AlertModal isVisible={tapsTooFastModalVisible} message={t("TAPS_TOO_FAST")} onClose={() => setTapsTooFastModalVisible(false)} />
        <AlertModal isVisible={notEnoughTapsModalVisible} message={t("NOT_ENOUGH_TAPS")} onClose={() => {
          setNotEnoughTapsModalVisible(false);
          if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
          }
        }} />
        <AlertModal isVisible={tapsInconsistentModalVisible} message={t("TAPS_INCONSISTENT")} onClose={() => setTapsInconsistentModalVisible(false)} />
      </View>
    </ScrollView>
  );
}
