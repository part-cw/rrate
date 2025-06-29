import * as React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from 'react-native-paper';
import { GlobalStyles as Style } from "../assets/styles";
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import useTranslation from '../utils/useTranslation';
import Copyright from "../components/Copyright";
import Slider from "../components/Slider";
import RadioButtonGroup from "../components/RadioButtonGroup";

// The configSettings page contains settings that should only be changed for research purposes, such as the measurement method, number of taps required, and 
// the consistency threshold.
export default function ConfigSettings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? React.useState('tap') : React.useState('timer');

  const numberOfTapsOptions = ["3", "4", "5", "6"];
  const consistencyThresholdOptions = ["10%", "11%", "12%", "13%", "14%"];

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
              <Slider values={numberOfTapsOptions} defaultValue={tapCountRequired.toString()} onSelect={(val) => {
                setTapCountRequired(parseInt(val));
              }} />
            </View>
          </View>

          {/* Consistency Threshold Selection*/}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}>Consistency Threshold </Text>
            <View style={{ paddingVertical: 20 }}>
              <Text>{t("CONSISTENCY_THRESH")}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Slider values={consistencyThresholdOptions} defaultValue={`${consistencyThreshold}%`} onSelect={(val) => {
                setConsistencyThreshold(parseInt(val.replace('%', '')));
              }} />
            </View>
          </View>

          <Copyright />

        </View>
      </ScrollView >
    </SafeAreaView>
  );
}