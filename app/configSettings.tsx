import * as React from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from 'react-native-paper';
import { GlobalStyles as Style } from "../assets/styles";
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import useTranslation from '../utils/useTranslation';
import Copyright from "../components/Copyright";
import RadioButtonGroup from "../components/RadioButtonGroup";
import Slider from "@react-native-community/slider";

// The configSettings page contains settings that should only be changed for research purposes, such as the measurement method, number of taps required, and 
// the consistency threshold.
export default function ConfigSettings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? React.useState('tap') : React.useState('timer');

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={Style.screenContainer}>
        <View style={Style.innerContainer}>
          <View style={{ alignItems: 'flex-start', width: 350 }}>
            <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
              {t("BACK")}
            </Button>
          </View>

          {/* Measurement Method Selection*/}
          <View style={[Style.floatingContainer]}>
            <Text style={Style.heading}> Measurement Method </Text>
            <RadioButtonGroup
              options={[
                { label: t("CHECK"), value: 'tap' },
                { label: t("ONEMIN"), value: 'timer' },
              ]}
              selected={measurementMethodRadioButton}
              onSelect={(value) => {
                setmeasurementMethodRadioButton(value);
                setMeasurementMethod(value === 'tap' ? "tap" : "timer");
                console.log("Measurement Method set to: " + measurementMethod);
              }}
            />
          </View>

          {/* Number of Taps Selection*/}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}>Taps </Text>
            <View style={{ paddingVertical: 20 }}>
              <Text>{t("CONSISTENCY_NUM_TAPS")}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Slider
                style={{ width: 300, height: Platform.OS == "web" ? 50 : 60 }}
                minimumValue={3}
                maximumValue={6}
                step={1}
                value={tapCountRequired}
                thumbTintColor={Theme.colors.primary}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                tapToSeek={true}
                StepMarker={({ stepMarked, index }) => (
                  <View style={[Style.marker]}>
                    <Text style={[stepMarked && Style.markerActive]}>{index}</Text>
                  </View>
                )}
                onValueChange={(value) => setTapCountRequired(value)}
              />
            </View>
          </View>

          {/* Consistency Threshold Selection*/}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}>Consistency Threshold </Text>
            <View style={{ paddingVertical: 20 }}>
              <Text>{t("CONSISTENCY_THRESH")}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Slider
                style={{ width: 300, height: Platform.OS == "web" ? 50 : 60 }}
                minimumValue={10}
                maximumValue={14}
                value={consistencyThreshold}
                step={1}
                thumbTintColor={Theme.colors.primary}
                minimumTrackTintColor="#000000"
                maximumTrackTintColor="#000000"
                tapToSeek={true}
                StepMarker={({ stepMarked, index }) => (
                  <View style={[Style.marker]}>
                    <Text style={[stepMarked && Style.markerActive]}>{index}%</Text>
                  </View>
                )}
                onValueChange={(value) => setConsistencyThreshold(value)}
              />
            </View>
          </View>

          <Copyright />

        </View>
      </ScrollView >
    </SafeAreaView>
  );
}