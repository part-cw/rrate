import { GlobalStyles as Style } from "../assets/styles";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Button, Switch, Checkbox, TextInput } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import * as React from "react";
import DropDown from "../components/DropdownList";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Copyright from "../components/Copyright";
import { useGlobalVariables } from "./globalContext";
import useTranslation from '@/hooks/useTranslation';
import PatientModelPicker from "../components/PatientModelPicker";

export default function Settings() {
  const router = useRouter();
  const { t } = useTranslation();
  const { selectedLanguage, setSelectedLanguage, ageThresholdEnabled, setAgeThresholdEnabled,
    REDCap, setREDCap, REDCapHost, setREDCapHost, REDCapURL, setREDCapURL, REDCapAPI, setREDCapAPI,
    LongitudinalStudy, setLongitudinalStudy, RepeatableInstruments, setRepeatableInstruments,
    UploadOnSave, setUploadOnSave,
  } = useGlobalVariables();


  const onToggleSwitch = () => {
    setAgeThresholdEnabled(!ageThresholdEnabled);
  }


  // ADD THIS IN FOR LATER VERSIONS THAT SUPPORT MULTIPLE LANGUAGES
  // const languages = [
  //   'Amharic', 'Aymara', 'Dinka', 'English', 'Español',
  //   'Français', 'Khmer', 'Luganda', 'Português', 'Quechua',
  // ];

  const languages = [
    'English'
  ];

  return (
    <ScrollView>
      <View style={Style.screenContainer}>
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push('/')}>
            {t("BACK")}
          </Button>
        </View>


        <View style={Style.floatingContainer}>

          <Text style={Style.heading}> Select Language </Text>
          <DropDown label={selectedLanguage} data={languages} onSelect={(val) => setSelectedLanguage(val)} />
        </View>


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

        <PatientModelPicker />

        <View style={Style.floatingContainer}>
          <Text style={Style.heading}> REDCap</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Checkbox
              status={REDCap ? 'checked' : 'unchecked'}
              onPress={() => {
                setREDCap(!REDCap);
              }}
            />
            <Text>{t("REDCAP_USE")}</Text>
          </View>

          {REDCap && (
            <View >
              <TextInput
                label={t("HOST")}
                value={REDCapHost}
                style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
                onChangeText={text => setREDCapHost(text)}
              />
              <TextInput
                label={t("URL")}
                value={REDCapURL}
                style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
                onChangeText={text => setREDCapURL(text)}
                placeholder="/redcap/api/"
              />
              <TextInput
                label={t("TOKEN")}
                value={REDCapAPI}
                style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
                onChangeText={text => setREDCapAPI(text)}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={LongitudinalStudy ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setLongitudinalStudy(!LongitudinalStudy);
                  }}
                />
                <Text>{t("LONGITUDINAL")}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={RepeatableInstruments ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setRepeatableInstruments(!RepeatableInstruments);
                  }}
                />
                <Text>{t("REP_EVENTS")}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={UploadOnSave ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setUploadOnSave(!UploadOnSave);
                  }}
                />
                <Text>{t("UPLOAD_SAVE")}</Text>
              </View>

            </View>
          )}

        </View>

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
  );
}