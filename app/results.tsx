import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import { GlobalStyles as Style } from '@/assets/styles';
import { useGlobalVariables } from '../utils/globalContext';
import DropdownList from '../components/DropdownList';
import ConsistencyChart from '../components/ConsistencyChart';
import useTranslation from '../utils/useTranslation';

// LOCAL VARIABLES
const ages = ['<2 months', '2–12 months', '>1 year'];
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

  const { rrate, babyAnimation, measurementMethod, ageThresholdEnabled, setRRTaps, UploadSingleRecord } = useGlobalVariables();
  const [rrateConfirmed, setRRateConfirmed] = useState<boolean>(false);

  // Variables for the baby animation
  const InflateSVG = babySVGMap[babyAnimation]?.inflate;
  const DeflateSVG = babySVGMap[babyAnimation]?.deflate;
  const [isInhaling, setIsInhaling] = useState(false);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate breaths/min for animation timing 
  const rate = Number(rrate) === 0 ? 40 : Number(rrate); // 40 is default rate for animation
  const secondsPerBreath = 60 / rate;
  const msPerBreath = secondsPerBreath * 1000;
  const halfCycle = msPerBreath / 2;

  // Start breathing loop: fade exhale out (inhale), then back in (exhale)
  const startBreathing = () => {
    animationIntervalRef.current = setInterval(() => {
      setIsInhaling(prev => !prev);
    }, halfCycle);
  };

  // On mount, begin the animation
  React.useEffect(() => {
    startBreathing();
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  // when animation is tapped, reset to start of exhalation state
  const handleTap = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }
    setIsInhaling(true);
    startBreathing();
  };

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
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
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
              <View style={[Style.SVGcontainer, { width: measurementMethod === 'timer' ? 360 : 310, height: measurementMethod === 'timer' ? 390 : 340 }]}>
                {isInhaling && InflateSVG &&
                  <InflateSVG
                    width={measurementMethod === 'timer' ? 360 : 310}
                    height={measurementMethod === 'timer' ? 390 : 340}
                  />}
                {!isInhaling && DeflateSVG &&
                  <DeflateSVG
                    width={measurementMethod === 'timer' ? 360 : 310}
                    height={measurementMethod === 'timer' ? 390 : 340}
                  />}
              </View>

            </Pressable>

            {/* Only show consistency chart if using rrate algorithm; too many taps otherwise */}
            {measurementMethod == "tap" && <ConsistencyChart showInfoButton />}

            {/* Sets bottom buttons based on whether user has confirmed rate or not */}
            {rrateConfirmed ? (
              <View style={[Style.floatingContainer, Style.darkButtonContainer]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
                  { /* TEST REDCap BUTTON */}
                  {UploadSingleRecord && (
                    <Button mode="contained"
                      buttonColor={Theme.colors.secondary}
                      style={{ paddingHorizontal: 30, marginRight: 10 }}
                      onPress={() => router.push("/saveDataToREDCap")}> REDCap </Button>
                  )}
                  <Button
                    icon="arrow-u-right-bottom"
                    buttonColor={Theme.colors["neutral-bttn"]}
                    mode="contained"
                    onPress={() => router.push("/")}
                    style={{ paddingHorizontal: 30, marginRight: 10 }}>
                    {t("RESTART")}
                  </Button>
                </View>
              </View>
            ) : (
              <View style={[Style.floatingContainer, Style.darkButtonContainer]}>
                <Text style={{ fontWeight: 'bold', color: "#ffffff" }}>{t("RR_MATCH")} </Text>
                <Text style={{ color: Theme.colors['neutral-bttn'], textAlign: 'center' }}>Tap the animation to sync with exhalation.</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
                  <Button
                    icon="check"
                    mode="contained"
                    buttonColor={Theme.colors.secondary}
                    onPress={() => setRRateConfirmed(true)}
                    style={{ paddingHorizontal: 30, marginRight: 10 }}>
                    {t("YES")}
                  </Button>
                  <Button
                    icon="close"
                    buttonColor={Theme.colors.tertiary}
                    mode="contained"
                    onPress={() => {
                      router.push("/");
                    }}
                    style={{ paddingHorizontal: 30, marginLeft: 10 }}>
                    {t("NO")}
                  </Button>
                </View>
              </View>)}
          </View>
        </View>
      </ScrollView >
    </SafeAreaView >
  );
}