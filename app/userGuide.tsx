import { View, Text, ScrollView } from "react-native";
import { Button } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles as Style } from "../assets/styles";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useGlobalVariables } from "../utils/globalContext";
import { Theme } from "../assets/theme";
import useTranslation from '../utils/useTranslation';
import { useRouter } from "expo-router";

// Explains how to use RRate
export default function Tutorial() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tapCountRequired } = useGlobalVariables();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={Style.screenContainer}>
        <View style={Style.innerContainer}>
          <View style={{ alignItems: 'flex-start' }}>
            <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
              {t("BACK")}
            </Button>
          </View>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons
              name="lungs"
              size={40}
              color={'#000000'}
              style={{ padding: 20 }}
            />
            <Text style={Style.pageTitle}>How to Use RRate</Text>
            <Text style={[Style.text, { textAlign: 'center', paddingVertical: 20 }]}>RRate helps healthcare providers accurately measure a patient's respiratory rate. Compared to traditional methods,
              RRate is faster, easy to use, and reduces rounding errors.</Text>
          </View>
          <View style={{ flexGrow: 2, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, gap: 15 }}>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.10)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>1. Take a Measurement</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>Tap the screen each time the patient inhales. The app will measure the median of intervals between breaths
                to estimate the rate and finish the measurement once a consistent rate is detected.</Text>
            </View>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.20)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>2. Compare with the Patient</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>Once RRate has calculated a consistent respiratory rate, it displays the rate alongside an animation of a baby breathing
                at that rate. Use the animation to visually compare with the patient’s breathing. Tap on the animation to sync it with the patient's inhalation.</Text>
            </View>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.30)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>3. Review the Consistency</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>RRate estimates a rate based on the previous {tapCountRequired} consistent taps. The consistency analysis chart
                shows whether your taps were fast, slow or consistent with the median time interval during the measurement.</Text>
            </View>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.40)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>4. Confirm the Rate</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>Select "Yes" if the rate matches the patient's breathing, and "No" if you need to redo the measurement.</Text>
            </View>
          </View>
        </View>
      </ScrollView >
    </SafeAreaView >
  );
}