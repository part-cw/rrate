import { View, Text, ScrollView, Platform, Pressable } from "react-native";
import { Button, Switch, TextInput } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalStyles as Style } from "../assets/styles";
import { useRouter } from "expo-router";
import { useGlobalVariables } from "../utils/globalContext";
import { Theme } from "../assets/theme";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import useTranslation from '../utils/useTranslation';
import DropDown from "../components/DropdownList";
import Copyright from "../components/Copyright";
import Checkbox from "../components/Checkbox";
import PatientModelPicker from "../components/PatientModelPicker";

// Displays all general settings for the app, including language selection, age interpretation, REDCap settings, and configuration settings.
export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { selectedLanguage, setSelectedLanguage, ageThresholdEnabled, setAgeThresholdEnabled, breathingAudioEnabled, setBreathingAudioEnabled,
    endChimeEnabled, setEndChimeEnabled, vibrationsEnabled, setVibrationsEnabled
  } = useGlobalVariables();

  const ageThresholdToggle = () => {
    setAgeThresholdEnabled(!ageThresholdEnabled);
  }

  // ADD THIS FOR LATER VERSIONS THAT SUPPORT MULTIPLE LANGUAGES
  // const languages = [
  //   'Amharic', 'Aymara', 'Dinka', 'English', 'Español',
  //   'Français', 'Khmer', 'Luganda', 'Português', 'Quechua',
  // ];

  const languages = [
    'English'
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={Style.screenContainer}>
        <View style={Style.innerContainer}>
          <View style={{ alignItems: 'flex-start' }}>
            <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.back()}>
              {t("BACK")}
            </Button>
          </View>

          {/* Language Selection */}
          <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}> Select Language </Text>
            <DropDown label={selectedLanguage} data={languages} onSelect={(val) => setSelectedLanguage(val)} />
          </View>

          {/* Patient Age Interpretation Dropdown */}
          <View style={Style.floatingContainer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={Style.heading}> Patient Age Interpretation </Text>
              <Switch value={ageThresholdEnabled}
                onValueChange={ageThresholdToggle} />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text style={{ color: "#707070" }}>Uses age-based thresholds to classify the respiratory rate as
                <Text style={{ color: Theme.colors.secondary, fontWeight: "bold" }}> normal</Text> or
                <Text style={{ color: Theme.colors.tertiary, fontWeight: "bold" }}> high.</Text> </Text>
            </View>
          </View>

          {/* Audio */}
          <View style={Style.floatingContainer}>
            <Text style={[Style.heading, { marginBottom: 10 }]}> Audio </Text>
            <Checkbox label="Breathing audio" checked={breathingAudioEnabled} onChange={() => setBreathingAudioEnabled(!breathingAudioEnabled)} />
            <Checkbox label="Vibration on inhalation" checked={vibrationsEnabled} onChange={() => setVibrationsEnabled(!vibrationsEnabled)} />
            <Checkbox label="Sound alert when measurement is complete" checked={endChimeEnabled} onChange={() => setEndChimeEnabled(!endChimeEnabled)} />

          </View>

          {/* Patient Model (Baby Animation) Selection */}
          <PatientModelPicker />

          {/* Configuration Settings */}
          <Pressable onPress={() => router.push('/passwordConfigSettings')}>
            <View style={[Style.floatingContainer, {
              flexDirection: 'row', alignItems: 'center'
            }]}>

              <EvilIcons name="lock" size={35} color="black" />
              <Text style={Style.heading}> Configuration Settings</Text>
            </View>
          </Pressable>

          <Copyright />

        </View>
      </ScrollView >
    </SafeAreaView>
  );
}