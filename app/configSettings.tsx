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
import RadioButtonGroup from "../components/radioButtonGroup";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold } = useGlobalVariables();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? React.useState('first') : React.useState('second');


  const numberOfTapsOptions = ["3", "4", "5", "6"];
  const consistencyThresholdOptions = ["10%", "11%", "12%", "13%", "14%"];

  return (
    <ScrollView contentContainerStyle={{
      margin: 30, paddingTop: 30, alignItems: 'center'
    }}>
      <View style={{ width: '100%', maxWidth: 350 }}>
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
            {t("BACK")}
          </Button>
        </View>


        <View style={[Style.floatingContainer, { padding: 30 }]}>
          <Text style={Style.heading}> Measurement Method </Text>
          <RadioButtonGroup
            options={[
              { label: t("CHECK"), value: 'first' },
              { label: t("ONEMIN"), value: 'second' },
            ]}
            selected={measurementMethodRadioButton}
            onSelect={setmeasurementMethodRadioButton}
          />
        </View>

        <View style={[Style.floatingContainer, { padding: 30 }]}>
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

        <View style={[Style.floatingContainer, { padding: 30 }]}>
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