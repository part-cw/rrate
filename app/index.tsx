import { View, Text, ScrollView, Image } from "react-native";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import { Theme } from "../assets/theme";
import { GlobalStyles as Style } from "@/assets/styles";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "./globalContext";
import useTranslation from '@/hooks/useTranslation';
import { evaluateRecentTaps, generateRRTapString } from '../utils/consistencyFunctions';
import TapCount from "../components/TapCount";
import AlertModal from "../components/AlertModal";
import Timer from '../components/Timer';

// The landing screen, where the measurement of respiratory rate takes place. 
export default function Index() {
  const router = useRouter();
  const { t } = useTranslation(); // use the function to get translations; pass in the keyword 

  // LOCAL VARIABLES
  const [timestamps, setTimestamps] = useState<number[]>([]);
  const [tapsTooFastModalVisible, setTapsTooFastModalVisible] = useState<boolean>(false);
  const [notEnoughTapsModalVisible, setNotEnoughTapsModalVisible] = useState<boolean>(false);
  const [tapsInconsistentModalVisible, setTapsInconsistentModalVisible] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false); // Tap on Inhalation button state
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // GLOBAL VARIABLES
  const { tapCountRequired, consistencyThreshold, setRRate, setTapTimestaps, rr_taps, set_rrTime, set_rrTaps, measurementMethod } = useGlobalVariables();

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
      console.log("Method:" + { measurementMethod });
      if (timestamps.length === 0 || notEnoughTapsModalVisible) return;

      // Set the timeout
      timeoutRef.current = setTimeout(() => {
        if (!notEnoughTapsModalVisible && !tapsTooFastModalVisible && !tapsInconsistentModalVisible && measurementMethod === 'tap') {
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

  // Start timer when first tap occurs; only if measurement method is set to 'tap for one minute'
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
      set_rrTaps(generateRRTapString(updated));
    } else if (measurementMethod === 'tap') {
      // Assess the consistency of taps to determine whether to proceed to results page
      consistencyCalculation();
    }
  }

  // calculates consistency of taps; proceeds to results page if rate is below 140 and consistent
  const consistencyCalculation = () => {
    const now = Date.now() / 1000;
    const updated = [...timestamps, now];
    setTimestamps(updated); // timestamps is an array of timestamps in seconds since start
    set_rrTaps(generateRRTapString(updated)); // rr_taps is the string formatted for REDCap

    if (updated.length < tapCountRequired) return; // ADDED THIS

    const result = evaluateRecentTaps({ timestamps: updated, tapCountRequired, consistencyThreshold });
    setRRate(result.rate.toString()); // set the respiratory rate in the global context so it can be used in other components
    setTapTimestaps(updated); // store timestamps in the global context
    const rrTaps = generateRRTapString(updated); // generate the string for REDCap
    set_rrTaps(rrTaps);
    set_rrTime(rrTaps.split(';')[0]);

    if (result.isConsistent === true) {
      if (result.rate < 140 && tapCountRef.current >= tapCountRequired) {
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
    <ScrollView contentContainerStyle={Style.screenContainer}>

      <View style={Style.innerContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ width: 40, height: 40 }} source={require('../assets/images/ubc-logo.png')} />
            <Text style={{ fontSize: 16 }}>RRate</Text>
          </View>
          <Button
            icon="cog"
            buttonColor={Theme.colors["neutral-bttn"]}
            mode="contained"
            onPress={() => {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }

              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }

              tapCountRef.current = 0;
              setTime(0);
              setTimestamps([]);
              setTimerRunning(false);
              set_rrTaps('');
              router.push("/settings");
            }
            }
          >
            <Text>{t("SETTINGS")}</Text>
          </Button>
        </View>

        <View style={[Style.componentContainer, { flexGrow: 1 }]}>
          {measurementMethod === 'tap' ?
            <TapCount tapCount={tapCountRef.current} /> : <Timer time={time} />
          }
        </View>

        <View style={[Style.componentContainer, { maxWidth: 500, flexGrow: 5 }]}>
          <Button
            mode="contained"

            contentStyle={{ height: 510, backgroundColor: isPressed ? Theme.colors.buttonPressed : Theme.colors.primary }}
            labelStyle={{ fontSize: 30, padding: 20 }}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
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
    </ScrollView >
  );
}
