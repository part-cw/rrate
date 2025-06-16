import { GlobalStyles as Style } from "../assets/styles";
import { View, Text, ScrollView } from "react-native";
import { Button, RadioButton } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import * as React from "react";
import Copyright from "../components/Copyright";
import Slider from "../components/Slider";
import { useGlobalVariables } from "./globalContext";
import useTranslation from '@/hooks/useTranslation';

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? React.useState('first') : React.useState('second');


  const numberOfTapsOptions = ["3", "4", "5", "6"];
  const consistencyThresholdOptions = ["10%", "11%", "12%", "13%", "14%"];

  return (
    <ScrollView contentContainerStyle={{
      margin: 30, paddingTop: 30, flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <View >
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push('/settings')}>
            {t("BACK")}
          </Button>
        </View>


        <View style={[Style.floatingContainer, { padding: 30 }]}>
          <Text style={Style.heading}> Measurement Method </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <RadioButton
              value="first"
              status={measurementMethodRadioButton === 'first' ? 'checked' : 'unchecked'}
              onPress={() => {
                setmeasurementMethodRadioButton('first');
                setMeasurementMethod('tap');
              }}
            />
            <Text>{t("CHECK")}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <RadioButton
              value="second"
              status={measurementMethodRadioButton === 'second' ? 'checked' : 'unchecked'}
              onPress={() => {
                setmeasurementMethodRadioButton('second');
                setMeasurementMethod('timer');
              }}
            />
            <Text>{t("ONEMIN")} </Text>
          </View>
        </View>

        <View style={[Style.floatingContainer, { padding: 30 }]}>
          <Text style={Style.heading}>Taps </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text>{t("CONSISTENCY_NUM_TAPS")}</Text>
          </View>
          <Slider values={numberOfTapsOptions} defaultValue={tapCountRequired.toString()} onSelect={(val) => {
            setTapCountRequired(parseInt(val));
          }} />
        </View>

        <View style={[Style.floatingContainer, { padding: 30 }]}>
          <Text style={Style.heading}>Consistency Threshold </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text>{t("CONSISTENCY_THRESH")}</Text>
          </View>
          <Slider values={consistencyThresholdOptions} defaultValue={`${consistencyThreshold}%`} onSelect={(val) => {
            setConsistencyThreshold(parseInt(val.replace('%', '')));
          }} />
        </View>

        <Copyright />

      </View>
    </ScrollView >
  );
}