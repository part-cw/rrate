import { GlobalStyles as Style } from "../assets/styles";
import { View, Text, ScrollView } from "react-native";
import { Button, RadioButton, Checkbox, TextInput } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import * as React from "react";
import Copyright from "../components/Copyright";
import Slider from "../components/Slider";

export default function Settings() {
  const router = useRouter();

  const [RRateSelected, setRRateSelected] = React.useState('first');

  return (
    <ScrollView>
      <View style={Style.screenContainer}>
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push('/settings')}>
            Back
          </Button>
        </View>


        <View style={Style.floatingContainer}>
          <Text style={Style.heading}> Measurement Method </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <RadioButton
              value="first"
              status={RRateSelected === 'first' ? 'checked' : 'unchecked'}
              onPress={() => setRRateSelected('first')}
            />
            <Text>Use RRate Algorithm </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <RadioButton
              value="second"
              status={RRateSelected === 'second' ? 'checked' : 'unchecked'}
              onPress={() => setRRateSelected('second')}
            />
            <Text>Tap for one minute </Text>
          </View>
        </View>

        <View style={Style.floatingContainer}>
          <Text style={Style.heading}>Taps </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text>Choose the number of consistent taps required for calculating the respiratory rate.</Text>
          </View>
          <Slider />
        </View>

        <View style={Style.floatingContainer}>
          <Text style={Style.heading}>Consistency Threshold </Text>
          <View style={{ paddingVertical: 20 }}>
            <Text>Choose the threshold offset from the median time interval between taps. </Text>
          </View>
        </View>

        <Copyright />

      </View>
    </ScrollView >
  );
}