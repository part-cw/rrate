import { GlobalStyles as Style } from "../assets/styles";
import { View, Text, ScrollView } from "react-native";
import { Button, RadioButton, Checkbox, TextInput } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import * as React from "react";
import Copyright from "../components/Copyright";
import Slider from "../components/Slider";
import { useSettings } from "./globalContext";

export default function Settings() {
  const router = useRouter();

  const { measurementMethod, setMeasurementMethod, tapCountRequired, setTapCountRequired, consistencyThreshold, setConsistencyThreshold } = useSettings();
  const [measurementMethodRadioButton, setmeasurementMethodRadioButton] = measurementMethod == "tap" ? React.useState('first') : React.useState('second');


  const numberOfTapsOptions = ["3", "4", "5", "6"];
  const consistencyThresholdOptions = ["10%", "11%", "12%", "13%", "14%"];

  console.log("Consistency Threshold: " + consistencyThreshold);
  console.log("Tap Count: " + tapCountRequired);

  return (
    <ScrollView>
      <View style={Style.screenContainer}>
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push('/settings')}>
            Back
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
            <Text>Use RRate Algorithm </Text>
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
            <Text>Tap for one minute </Text>
          </View>
        </View>

        <View style={[Style.floatingContainer, { padding: 30 }]}>
          <Text style={Style.heading}>Taps </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text>Choose the number of consistent taps required for calculating the respiratory rate.</Text>
          </View>
          <Slider values={numberOfTapsOptions} defaultValue={tapCountRequired.toString()} onSelect={(val) => {
            setTapCountRequired(parseInt(val))


            console.log("Tap Count: " + tapCountRequired);
          }} />
        </View>

        <View style={[Style.floatingContainer, { padding: 30 }]}>
          <Text style={Style.heading}>Consistency Threshold </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text>Choose the threshold offset from the median time interval between taps. </Text>
          </View>
          <Slider values={consistencyThresholdOptions} defaultValue={`${consistencyThreshold}%`} onSelect={(val) => {
            setConsistencyThreshold(parseInt(val.replace('%', '')));
            console.log("Consistency Threshold: " + consistencyThreshold);
          }} />
        </View>

        <Copyright />

      </View>
    </ScrollView >
  );
}