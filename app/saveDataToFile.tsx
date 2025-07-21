import { View, Text, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';
import { Button, TextInput } from 'react-native-paper';
import { useGlobalVariables } from '../utils/globalContext';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import useTranslation from '../utils/useTranslation';
import { saveSessionToCSV } from '../utils/storeSessionData';
import { GlobalStyles as Style } from '@/assets/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Page for saving single measurement to AsyncStorage
export default function SaveDataToFile() {
  const router = useRouter();
  const { t } = useTranslation();
  const [response, setResponse] = useState<string | null>(null);
  const [recordID, setRecordID] = useState<string>("");

  const { rrTaps, rrate, rrTime, tapTimestamps } = useGlobalVariables();
  const [recordSaved, setRecordSaved] = useState<boolean>(false);

  // Handles save of most recent session, posting record ID, rate, time, and tap string to local storage
  const handleSingleUpload = async () => {

    try {
      const result = await saveSessionToCSV(recordID, rrate, rrTaps, rrTime);
      setResponse('Saved successfully!');
      setRecordSaved(true);

    } catch (error: any) {
      setResponse('Save failed: ' + error.message);
      console.log("Error: ", error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0} >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={Style.redirectScreenContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'center', width: 350 }}>
            <MaterialCommunityIcons
              name="content-save-check-outline"
              size={40}
              color={'#000000'}
              style={{ padding: 20 }}
            />
            <Text style={Style.pageTitle}>Save Data</Text>
            <Text style={[Style.text, { paddingBottom: 10 }]} > <Text style={{ fontWeight: 'bold' }}>Rate:</Text> {rrate} breaths /min </Text>
            <Text style={[Style.text, { paddingBottom: 10 }]}> <Text style={{ fontWeight: 'bold' }}>Number of Taps:</Text> {tapTimestamps.length} </Text>
            <Text style={Style.text}> <Text style={{ fontWeight: 'bold' }}>Time:</Text> {rrTime} </Text>
            <View style={{ width: '50%' }}>
              <TextInput
                label="Record ID"
                value={recordID}
                style={[Style.textField, { marginBottom: 0 }]}
                onChangeText={text => setRecordID(text)}
              />
            </View>
            <View style={Style.lightButtonContainer}>
              {!recordSaved && <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => router.back()}>
                {t("BACK")}
              </Button>}

              {!recordSaved ? <Button icon="arrow-collapse-down" buttonColor={Theme.colors.secondary} mode="contained" style={{ marginHorizontal: 5 }} onPress={() => { handleSingleUpload() }}>
                {t("SAVE")}  </Button> :
                <Button icon="arrow-u-right-bottom" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push("/")} style={{ paddingHorizontal: 30, }}>
                  {t("RESTART")} </Button>
              }
            </View>
            {response && (
              <View style={{ justifyContent: 'center', alignItems: 'center', width: 300 }}>
                <Text style={{ fontSize: 16, textAlign: 'center' }}>{response}</Text>
              </View>
            )}
          </View>
        </View >
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}