import { View, Text, ScrollView } from "react-native";
import { Button } from 'react-native-paper';
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
    <ScrollView contentContainerStyle={Style.screenContainer}>
      <View style={Style.innerContainer}>
        <View style={{ alignItems: 'flex-start' }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
            {t("BACK")}
          </Button>
        </View>
        <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons
              name="lungs"
              size={40}
              color={'#000000'}
              style={{ padding: 20 }}
            />
            <Text style={Style.pageTitle}>{t("HOW_TO")}</Text>
            <Text style={[Style.text, { textAlign: 'center', paddingVertical: 20 }]}>{t("INTRO")}</Text>
          </View>
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, gap: 15 }}>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.10)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>1. {t("TAKE_MEASUREMENT")}</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>{t("TAKE_MEAS_DESC")}</Text>
            </View>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.20)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>2. {t("COMPARE_W_PATIENT")}</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>{t("COMPARE_W_PATIENT_DESC")}</Text>
            </View>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.30)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>3. {t("REVIEW_CONST")}</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>{t("REVIEW_CONST_DESC")}</Text>
            </View>
            <View style={[Style.tutorialBox, { backgroundColor: "rgba(39, 92, 172, 0.40)" }]}>
              <Text style={[Style.heading, { textAlign: 'center' }]}>4. {t("CONFIRM")}</Text>
              <Text style={[Style.text, { textAlign: 'center', paddingVertical: 10 }]}>{t("CONFIRM_DESC")}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView >
  );
}