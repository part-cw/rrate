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
import PatientModelPicker from "../components/PatientModelPicker";
import Checkbox from "../components/Checkbox";

// Displays all general settings for the app, including language selection, age interpretation, REDCap settings, and configuration settings.
export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();

  const { selectedLanguage, setSelectedLanguage, ageThresholdEnabled, setAgeThresholdEnabled,
    REDCap, setREDCap, REDCapHost, setREDCapHost, REDCapURL, setREDCapURL, REDCapAPI, setREDCapAPI,
    LongitudinalStudy, setLongitudinalStudy, UsingRepeatableInstruments, setUsingRepeatableInstruments,
    UploadSingleRecord, setUploadSingleRecord, setLongitudinalStudyEvent, setRepeatableInstrument
  } = useGlobalVariables();

  const onToggleSwitch = () => {
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
                onValueChange={onToggleSwitch} />
            </View>
            <View style={{ marginVertical: 20 }}>
              <Text style={{ color: "#707070" }}>Uses age-based thresholds to classify the respiratory rate as
                <Text style={{ color: Theme.colors.secondary, fontWeight: "bold" }}> normal</Text> or
                <Text style={{ color: Theme.colors.tertiary, fontWeight: "bold" }}> high.</Text> </Text>
            </View>
          </View>

          {/* Patient Model (Baby Animation) Selection */}
          <PatientModelPicker />

          {/* REDCap Settings */}
          <View style={Style.floatingContainer}>
            <Text style={Style.heading}> REDCap</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Checkbox label={t("REDCAP_USE")} checked={REDCap} onChange={() => { setREDCap(!REDCap) }} />
            </View>

            {REDCap && (
              <View >
                <TextInput label={t("HOST")} value={REDCapHost} style={Style.textField} onChangeText={text => setREDCapHost(text)} />
                <TextInput label={t("URL")} value={REDCapURL} style={Style.textField} onChangeText={text => setREDCapURL(text)} placeholder="/redcap/api/" />
                <TextInput
                  label={t("TOKEN")}
                  value={REDCapAPI}
                  style={Style.textField}
                  onChangeText={text => {
                    setREDCapAPI(text);
                  }}
                />

                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox label={t("LONGITUDINAL")} checked={LongitudinalStudy} onChange={() => setLongitudinalStudy(!LongitudinalStudy)} />
                  </View>
                  {LongitudinalStudy && (
                    <TextInput
                      label="Event"
                      onChangeText={text => setLongitudinalStudyEvent(text)} />)}
                </View>

                <View style={{ flexDirection: 'column' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Checkbox label={t("REP_FORMS")} checked={UsingRepeatableInstruments} onChange={() => setUsingRepeatableInstruments(!UsingRepeatableInstruments)} />
                  </View>
                  {UsingRepeatableInstruments && (
                    <TextInput label="Instrument" onChangeText={text => setRepeatableInstrument(text)} />)}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Checkbox label="Upload After Each Measurement" checked={UploadSingleRecord} onChange={() => setUploadSingleRecord(!UploadSingleRecord)} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                  {!UploadSingleRecord && REDCapHost && REDCapURL && REDCapAPI && (
                    <Button mode="contained" contentStyle={{ backgroundColor: Theme.colors.tertiary }} onPress={() => console.log("Save to REDCap")} >Upload to REDCap</Button>)}
                </View>
              </View>
            )}
          </View>

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