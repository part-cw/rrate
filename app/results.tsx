
import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, Text, StyleSheet, Pressable } from 'react-native';
import DropdownList from '../components/DropdownList';
import { GlobalStyles as Style } from '@/assets/styles';
import { Button } from 'react-native-paper';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import ConsistencyChart from '../components/ConsistencyChart';
import { useGlobalVariables } from './globalContext';
import useTranslation from '@/hooks/useTranslation';

const ages = ['default', '<2 months', '2–12 months', '>1 year'];

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


export default function Results() {
  const router = useRouter();
  const { t } = useTranslation();

  const { rrate, age, setAge, babyAnimation, measurementMethod, ageThresholdEnabled, set_rrTaps } = useGlobalVariables();
  const [rrateConfirmed, setRRateConfirmed] = useState<boolean>(false);

  const InflateSVG = babySVGMap[babyAnimation]?.inflate;
  const DeflateSVG = babySVGMap[babyAnimation]?.deflate;

  const fadeOutSVG = useRef(new Animated.Value(0)).current; // start at exhale (fully visible)
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Calculate breaths/min for animation timing 
  const rate = Number(rrate) === 0 ? 40 : Number(rrate);
  const secondsPerBreath = 60 / rate;
  const msPerBreath = secondsPerBreath * 1000;
  const halfCycle = msPerBreath / 2;


  // Start breathing loop: fade exhale out (inhale), then back in (exhale)
  const startBreathing = () => {
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeOutSVG, {
          toValue: 1,
          duration: halfCycle,
          useNativeDriver: true,
        }),
        Animated.timing(fadeOutSVG, {
          toValue: 0,
          duration: halfCycle,
          useNativeDriver: true,
        }),
      ])
    );
    animationRef.current.start();
  };

  // On mount, begin the animation
  React.useEffect(() => {
    startBreathing();
    return () => animationRef.current?.stop();
  }, []);

  // When tapped: reset to exhale state, restart inhale from there
  const handleTap = () => {
    animationRef.current?.stop();
    fadeOutSVG.setValue(0); // fully exhaled
    startBreathing();       // restart cycle
  };


  let rrateColour;

  if (age === '<2 months') {
    if (Number(rrate) > 60) {
      rrateColour = Theme.colors.tertiary;
    } else {
      rrateColour = Theme.colors.secondary;
    }
  } else if (age === '2–12 months') {
    if (Number(rrate) > 50) {
      rrateColour = Theme.colors.tertiary;
    } else {
      rrateColour = Theme.colors.secondary;
    }
  } else if (age === '>1 year') {
    if (Number(rrate) > 40) {
      rrateColour = Theme.colors.tertiary;
    } else {
      rrateColour = Theme.colors.secondary;
    }
  }


  return (
    <View style={Style.screenContainer}>
      <View style={[Style.floatingContainer, { flexDirection: 'row', zIndex: 10, height: 150 }]}>
        <View style={Style.leftColumn}>
          <Text style={[Style.rateValue, { color: rrateColour }]}>{rrate}</Text>
        </View>

        <View style={Style.rightColumn}>
          <Text style={Style.labelMain}>{t("RRATE")}</Text>
          <Text style={Style.labelSub}>{t("RRATE_UNIT")}</Text>

          {ageThresholdEnabled && <View>
            <View style={Style.divider} />

            <View style={Style.dropdownContainer}>
              <Text style={Style.ageLabel}>Age</Text>
              <View style={{ width: 150 }}>
                <DropdownList label={age} data={ages} onSelect={setAge} />
              </View>
            </View>
          </View>
          }

        </View>
      </View>

      <Pressable onPress={handleTap} style={{ zIndex: 1 }}>
        <View style={styles.container}>
          {/* Inhale is always fully visible */}
          {DeflateSVG && <DeflateSVG width={320} height={350} />}

          {/* Exhale fades in and out above it */}
          {InflateSVG &&
            <Animated.View style={[styles.overlay, { opacity: fadeOutSVG }]}>
              <InflateSVG width={320} height={350} />
            </Animated.View>
          }
        </View>
      </Pressable>


      {measurementMethod == "tap" && <ConsistencyChart showInfoButton />}

      {rrateConfirmed ? (

        <View style={[Style.floatingContainer, { backgroundColor: "#3F3D3D", justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
            <Button
              icon="arrow-u-right-bottom"
              buttonColor={Theme.colors["neutral-bttn"]}
              mode="contained"
              onPress={() => router.push("/")}
              style={{ paddingHorizontal: 20 }}>
              {t("RESTART")}
            </Button>
          </View>
        </View>

      ) : (
        <View style={[Style.floatingContainer, { backgroundColor: "#3F3D3D", justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontWeight: 'bold', color: "#ffffff" }}>{t("RR_MATCH")} </Text>
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
                set_rrTaps(''); // Reset rr_taps in global context}
              }}
              style={{ paddingHorizontal: 30, marginLeft: 10 }}>
              {t("NO")}
            </Button>
          </View>
        </View>)}

    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 350,
    position: 'relative',
    margin: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});