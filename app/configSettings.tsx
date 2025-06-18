import * as React from "react";
import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import { Button } from 'react-native-paper';
import { GlobalStyles as Style } from "../assets/styles";
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "./globalContext";
import useTranslation from '@/hooks/useTranslation';
import Copyright from "../components/Copyright";
import Slider from "../components/Slider";
import RadioButtonGroup from "../components/radioButtonGroup";

// The configSettings page contains settings that should only be changed for research purposes, such as the measurement method, number of taps required, and 
// consistency threshold for respiratory rate measurements.
export default function configSettings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { width } = useWindowDimensions();
  const dynamicPadding = width > 400 ? 30 : 20;

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? React.useState('tap') : React.useState('timer');

  const numberOfTapsOptions = ["3", "4", "5", "6"];
  const consistencyThresholdOptions = ["10%", "11%", "12%", "13%", "14%"];

  return (
    <ScrollView contentContainerStyle={Style.screenContainer}>
      <View style={Style.innerContainer}>
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
            {t("BACK")}
          </Button>
        </View>

        {/* Measurement Method Selection*/}
        <View style={[Style.floatingContainer, { padding: dynamicPadding }]}>
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
        <View style={[Style.floatingContainer, { padding: dynamicPadding }]}>
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
        <View style={[Style.floatingContainer, { padding: dynamicPadding }]}>
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
  );
}