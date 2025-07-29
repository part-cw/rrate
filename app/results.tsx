import React, { useState, useRef, useCallback } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { Theme } from '../assets/theme';
import * as Haptics from 'expo-haptics';
import { useAudioPlayer } from 'expo-audio';
import loadAndPlayAudio from '../utils/audioFunctions';
import { Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { GlobalStyles as Style } from '@/assets/styles';
import { useGlobalVariables } from '../utils/globalContext';
import { useFHIRContext } from '../utils/fhirContext';
import { sendFHIRObservation, sendFHIRObservationToApp } from '../utils/fhirFunctions';
import DropdownList from '../components/DropdownList';
import ConsistencyChart from '../components/ConsistencyChart';
import useTranslation from '../utils/useTranslation';

// LOCAL VARIABLES
const ages = ['<2 months', '2–12 months', '>1 year'];
const audioSource = require('../assets/audio/breathing.mp3');
const babySVGMap = {
  1: {
    inflate: require('../assets/babyAnimation/Baby1_inflate.svg').default,
    deflate: require('../assets/babyAnimation/Baby1_deflate.svg').default,
  },
  2: {
    inflate: require('../assets/babyAnimation/Baby2_inflate.svg').default,
    deflate: require('../assets/babyAnimation/Baby2_deflate.svg').default,
  },
  3: {
    inflate: require('../assets/babyAnimation/Baby3_inflate.svg').default,
    deflate: require('../assets/babyAnimation/Baby3_deflate.svg').default,
  },
  4: {
    inflate: require('../assets/babyAnimation/Baby4_inflate.svg').default,
    deflate: require('../assets/babyAnimation/Baby4_deflate.svg').default,
  },
  5: {
    inflate: require('../assets/babyAnimation/Baby5_inflate.svg').default,
    deflate: require('../assets/babyAnimation/Baby5_deflate.svg').default,
  },
  6: {
    inflate: require('../assets/babyAnimation/Baby6_inflate.svg').default,
    deflate: require('../assets/babyAnimation/Baby6_deflate.svg').default,
  },
}

// The Results screen displays the respiratory rate, baby animation and the option to review the tap consistency chart.
export default function Results() {
  const router = useRouter();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();

  const [age, setAge] = useState<string>("Set Age");

  const { rrate, babyAnimation, measurementMethod, ageThresholdEnabled, sensoryFeedbackAfterMeasurement, sensoryFeedbackMethod, REDCap, exportDataEnabled } = useGlobalVariables();
  const { launchType, setLaunchType, patientId, accessToken, returnURL, FHIRBaseURL } = useFHIRContext();
  const { rrateConfirmed: rrateConfirmedParam, isRecordSaved: isRecordSavedParam } = useLocalSearchParams(); // must be passed in via index.tsx
  const [rrateConfirmed, setRRateConfirmed] = useState<boolean>(rrateConfirmedParam === 'true'); // reference the local search params
  const [isRecordSaved, setIsRecordSaved] = useState<boolean>(isRecordSavedParam === 'true');

  const player = useAudioPlayer(audioSource);

  // Variables for the baby animation
  const InflateSVG = babySVGMap[babyAnimation as keyof typeof babySVGMap]?.inflate;
  const DeflateSVG = babySVGMap[babyAnimation as keyof typeof babySVGMap]?.deflate;
  const [isInhaling, setIsInhaling] = useState(false);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate breaths/min for animation timing 
  const rate = Number(rrate) === 0 ? 40 : Number(rrate); // 40 is default rate for animation
  const secondsPerBreath = 60 / rate;
  const msPerBreath = secondsPerBreath * 1000;
  const halfCycle = msPerBreath / 2;

  // Start breathing loop: fade exhale out (exhale), then back in (inhale)
  const startBreathing = () => {
    animationIntervalRef.current = setInterval(() => {
      setIsInhaling(prev => {
        const next = !prev;
        if (next && sensoryFeedbackAfterMeasurement) {
          if (sensoryFeedbackMethod === 'Audio') {
            loadAndPlayAudio(player);
          } else if (sensoryFeedbackMethod === 'Vibrate') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
        }
        return next;
      });
    }, halfCycle);
  };

  // On mount, begin the animation
  useFocusEffect(
    useCallback(() => {
      startBreathing();

      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }
        if (player && sensoryFeedbackAfterMeasurement) {
          player.pause?.();
        }
      };
    }, [])
  );

  // When animation is tapped, reset to start of exhalation state
  const handleTap = async () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setIsInhaling(true);
    startBreathing();
  };

  // Handles the case where the user confirms the respiratory rate. 
  // If opened through PARA, send the FHIR observation via redirect URL to app; if opened through EMR, send the FHIR observation to the server and redirect back to EMR.
  // If no redirection is needed, variable change will cause button logic to show restart button on animation screen.
  const handleCorrectMeasurement = async () => {
    setRRateConfirmed(true);
    if (launchType === 'app') {
      const fullUrl = await sendFHIRObservationToApp(patientId, rrate, returnURL);
      setLaunchType('standalone'); // reset launch type to standalone for next use
      try {
        await Linking.openURL(fullUrl);
      } catch (error) {
        console.error('Failed to return to app:', error);
      }
    } else if (launchType === 'emr') {
      setLaunchType('standalone'); // reset launch type to standalone for next use
      await sendFHIRObservation(FHIRBaseURL, patientId, rrate, accessToken);
      window.location.href = returnURL;
    } else if (REDCap) { // standalone launch
      router.push('/saveDataToREDCap');
    } else if (exportDataEnabled) {
      router.push('/saveDataToFile');
    }
  }

  // Determine the colour of the respiratory rate value based on age and rate
  let rrateColour;
  let rrateSeverity = 'normal';

  if (age === '<2 months') {
    if (Number(rrate) > 60) {
      rrateColour = Theme.colors.tertiary;
      rrateSeverity = 'high';
    } else {
      rrateColour = Theme.colors.secondary;
    }
  } else if (age === '2–12 months') {
    if (Number(rrate) > 50) {
      rrateColour = Theme.colors.tertiary;
      rrateSeverity = 'high';
    } else {
      rrateColour = Theme.colors.secondary;
    }
  } else if (age === '>1 year') {
    if (Number(rrate) > 40) {
      rrateColour = Theme.colors.tertiary;
      rrateSeverity = 'high';
    } else {
      rrateColour = Theme.colors.secondary;
    }
  }

  return (
    <ScrollView contentContainerStyle={Style.screenContainer}>
      <View style={Style.innerContainer}>

        {/* RRate Display */}
        <View style={[Style.floatingContainer, Style.rrateContainer, { paddingHorizontal: width < 430 ? '7%' : '10%' }]}>
          <View style={Style.leftColumn}>
            <Text style={[Style.rateValue, { color: rrateColour }]}>{rrate}</Text>
            {ageThresholdEnabled && age && <Text style={{ color: rrateColour }}>{rrateSeverity}</Text>}
          </View>

          <View style={Style.rightColumn}>
            <Text style={Style.labelMain}>{t("RRATE")}</Text>
            <Text style={Style.labelSub}>{t("RRATE_UNIT")}</Text>

            {ageThresholdEnabled && <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={Style.divider} />
              <View style={Style.dropdownContainer}>
                <View style={{ width: 150 }}>
                  <DropdownList label={age} data={ages} onSelect={setAge} />
                </View>
              </View>
            </View>
            }
          </View>
        </View>

        {/* Baby Animation and Consistency Chart */}
        <View>
          <Pressable onPress={handleTap} style={[Style.pressableContainer, { paddingTop: measurementMethod == 'timer' ? 30 : 0, }]}>
            <View style={[Style.SVGcontainer, { width: measurementMethod === 'timer' ? 350 : 300, height: measurementMethod === 'timer' ? 380 : 330 }]}>
              {isInhaling && InflateSVG &&
                <InflateSVG
                  width={measurementMethod === 'timer' ? 350 : 300}
                  height={measurementMethod === 'timer' ? 380 : 330}
                />}
              {!isInhaling && DeflateSVG &&
                <DeflateSVG
                  width={measurementMethod === 'timer' ? 350 : 300}
                  height={measurementMethod === 'timer' ? 380 : 330}
                />}
            </View>
          </Pressable>

          {/* Only show consistency chart if using rrate algorithm; too many taps otherwise */}
          {measurementMethod == "tap" && <ConsistencyChart showInfoButton />}

          {/* Sets bottom buttons based on whether user has confirmed rate or not */}
          {rrateConfirmed ? (
            <View style={[Style.floatingContainer, Style.darkButtonContainer]}>
              <View style={{ flexDirection: Platform.OS === 'web' ? 'row' : 'column', justifyContent: 'center', alignContent: 'center' }} >
                {!isRecordSaved && REDCap &&
                  <Button
                    icon="content-save-check-outline"
                    buttonColor={Theme.colors.secondary}
                    mode="contained"
                    onPress={() => router.push("/saveDataToREDCap")}
                    style={{ width: '100%', marginVertical: 2, marginHorizontal: 5 }}>
                    Save to REDCap
                  </Button>
                }
                <Button
                  icon="arrow-u-right-bottom"
                  buttonColor={Theme.colors["neutral-bttn"]}
                  mode="contained"
                  onPress={() => router.push("/")}
                  style={{ marginVertical: 2, marginHorizontal: 5 }}>
                  {t("RESTART")}
                </Button>
              </View>
            </View>
          ) : (
            <View style={[Style.floatingContainer, Style.darkButtonContainer]}>
              <Text style={{ fontWeight: 'bold', color: "#ffffff" }}>{t("RR_MATCH")} </Text>
              <Text style={{ color: Theme.colors['neutral-bttn'], textAlign: 'center' }}>Tap the animation to sync with inhalation</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
                <Button
                  icon="check"
                  mode="contained"
                  buttonColor={Theme.colors.secondary}
                  onPress={() => {
                    handleCorrectMeasurement();
                  }}
                  style={{ width: 150, marginHorizontal: 5 }}>
                  {t("YES")}
                </Button>
                <Button
                  icon="close"
                  buttonColor={Theme.colors.tertiary}
                  mode="contained"
                  onPress={() => {
                    router.push("/");
                  }}
                  style={{ width: 150, marginHorizontal: 5 }}>
                  {t("NO")}
                </Button>
              </View>
            </View>)}
        </View>
      </View>
    </ScrollView >
  );
}