import { View, Text, Pressable } from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { Theme } from "../assets/theme";
import { GlobalStyles as Style } from "@/assets/styles";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import useTranslation from '../utils/useTranslation';
import { evaluateRecentTaps, generateRRTapString } from '../utils/consistencyFunctions';
import TapCount from "../components/TapCount";
import AlertModal from "../components/AlertModal";
import Timer from '../components/Timer';

// The landing screen, where the measurement of respiratory rate takes place. 
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation(); // use this function to get translations; pass in the keyword 

  // LOCAL VARIABLES
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [tapsTooFastModalVisible, setTapsTooFastModalVisible] = useState<boolean>(false);
  const [notEnoughTapsModalVisible, setNotEnoughTapsModalVisible] = useState<boolean>(false);
  const [tapsInconsistentModalVisible, setTapsInconsistentModalVisible] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false); // Tap on Inhalation button state
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // GLOBAL VARIABLES
  const { tapCountRequired, consistencyThreshold, setRRate, setTapTimestaps, setRRTime, setRRTaps, measurementMethod } = useGlobalVariables();

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

  // Updates the reference of the Not Enough Taps modal whenever modal visibility changes
  useEffect(() => {
    notEnoughTapsVisibleRef.current = notEnoughTapsModalVisible;
  }, [notEnoughTapsModalVisible]);

  // Sets up a timeout to trigger the Not Enough Taps modal if the interval from the last tap is greater than 60 seconds
  useFocusEffect(
    useCallback(() => {
      if (timestamps.length === 0 || notEnoughTapsModalVisible) return;

      timeoutRef.current = setTimeout(() => {
        if (!notEnoughTapsModalVisible && !tapsTooFastModalVisible && !tapsInconsistentModalVisible && measurementMethod === 'tap') {
          notEnoughTaps();
        }
      }, 60000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, [timestamps, notEnoughTapsModalVisible])
  );

  // Reset all variables and intervals when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Reset all relevant variables whenever the screen is focused (entered)
      tapCountRef.current = 0;
      setTime(0);
      setTimestamps([]);
      setTimerRunning(false);
      setRRTaps('');
      setRRate('');
      setTapTimestaps([]);
      setRRTime('');

      // Clear any timers just in case
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      return () => {
        //Clear on screen unmount to prevent the timers from continuing in the background
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
    }, [])
  );

  // Start timer when first tap occurs, only occurs when measurement method is set to 'tap for one minute'
  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTime(prev => {
        if (prev >= 59) {
          clearInterval(intervalRef.current!);
          setRRate(tapCountRef.current.toString());
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

    if (measurementMethod === 'timer') {
      // Start timer only on first tap
      if (!timerRunning) {
        startTimer();
        setTimerRunning(true);
      }

      const updated = [...timestamps, now];
      setTimestamps(updated);
      setRRTaps(generateRRTapString(updated));
    } else if (measurementMethod === 'tap') {
      // Assess the consistency of taps to determine whether to proceed to results page
      consistencyCalculation();
    }
  }

  // calculates consistency of taps; proceeds to results page if rate is below 140 and consistent
  function consistencyCalculation() {
    const now = Date.now() / 1000; // timestamp in seconds since epoch
    const updated = [...timestamps, now];
    setTimestamps(updated); // timestamps is an array of timestamps in seconds since start
    setRRTaps(generateRRTapString(updated)); // rr_taps is the string formatted for REDCap

    if (updated.length < tapCountRequired) return;

    const result = evaluateRecentTaps({ timestamps: updated, tapCountRequired, consistencyThreshold });
    setRRate(result.rate.toString()); // set the respiratory rate in the global context so it can be used in other components
    setTapTimestaps(updated); // store timestamps in the global context
    const rrTaps = generateRRTapString(updated); // generate the string for REDCap
    setRRTaps(rrTaps);
    setRRTime(rrTaps.split(';')[0]);

    if (result.isConsistent === true) {
      if (result.rate < 140 && tapCountRef.current >= tapCountRequired) {
        console.log(updated);
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
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <View style={Style.screenContainer}>
        <View style={Style.innerContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1 }}>
            <Button
              icon="close"
              buttonColor={Theme.colors.tertiary}
              mode="contained"
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => { router.push("/") }}>
              <Text>{t("CANCEL")}</Text>
            </Button>
            <Button
              icon="cog"
              buttonColor={Theme.colors["neutral-bttn"]}
              mode="contained"
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={() => { router.push("/settings"); }}>
              <Text>{t("SETTINGS")}</Text>
            </Button>
          </View>

          {/* Show either the Tap Count or Timer, depending on the user's settings for the measurement method. */}
          <View style={[Style.componentContainer, { flexGrow: 1 }]}>
            {measurementMethod === 'tap' ?
              <TapCount tapCount={tapCountRef.current} /> : <Timer time={time} />
            }
          </View>

          {/* Use Pressable instead of React Native Button to allow for larger button size and clickable area */}
          <View style={[Style.componentContainer, { maxWidth: 500, flexGrow: 99 }]}>
            <Pressable
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              onPress={countAndCalculateTap}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isPressed ? Theme.colors.buttonPressed : Theme.colors.primary,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 30, color: 'white', textAlign: 'center', padding: 20 }}>
                {t("TAP_INHALATION")}
              </Text>
            </Pressable>
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
      </View >
    </SafeAreaView >
  );
}
