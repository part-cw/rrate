import { GlobalStyles as Style } from "../assets/styles";
import { View, Text, ScrollView, Pressable } from "react-native";
import { Button, Switch, Checkbox, TextInput } from 'react-native-paper';
import { Theme } from "../assets/theme";
import { useRouter } from "expo-router";
import * as React from "react";
import DropDown from "../components/DropdownList";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import Copyright from "../components/Copyright";

export default function Settings() {
  const router = useRouter();

  // Patient age interpretation switch
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);
  // REDCap checkbox
  const [REDCapchecked, setREDCapchecked] = React.useState(false);
  const [LongitudinalChecked, setLongitudinalChecked] = React.useState(false);
  const [RepeatableChecked, setRepeatableChecked] = React.useState(false);
  const [UploadChecked, setUploadChecked] = React.useState(false);
  const [hostText, sethostText] = React.useState("");
  const [URL, setURL] = React.useState("");
  const [API, setAPI] = React.useState("");


  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  const languages = [
    'Amharic', 'Aymara', 'Dinka', 'English', 'Español',
    'Français', 'Khmer', 'Luganda', 'Português', 'Quechua',
  ];

  return (
    <ScrollView>
      <View style={Style.screenContainer}>
        <View style={{ alignItems: 'flex-start', width: 350 }}>
          <Button icon="chevron-left" buttonColor={Theme.colors["neutral-bttn"]} mode="contained" onPress={() => router.push('/')}>
            Back
          </Button>
        </View>


        <View style={Style.floatingContainer}>
          <DropDown label="Select Language" data={languages} />
        </View>


        <View style={Style.floatingContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={Style.heading}> Patient Age Interpretation </Text>
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          </View>
          <View style={{ marginVertical: 20 }}>
            <Text style={{ color: "#707070" }}>Uses age-based thresholds to classify the respiratory rate as normal or high. </Text>
          </View>
        </View>

        <View style={Style.floatingContainer}>
          <Text style={Style.heading}> Patient Model </Text>
        </View>

        <View style={Style.floatingContainer}>
          <Text style={Style.heading}> REDCap</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
            <Checkbox
              status={REDCapchecked ? 'checked' : 'unchecked'}
              onPress={() => {
                setREDCapchecked(!REDCapchecked);
              }}
            />
            <Text> Save data for upload to REDCap</Text>
          </View>

          {REDCapchecked && (
            <View >
              <TextInput
                label="Host"
                value={hostText}
                style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
                onChangeText={text => sethostText(text)}
              />
              <TextInput
                label="URL"
                value={URL}
                style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
                onChangeText={text => setURL(text)}
                placeholder="/redcap/api/"
              />
              <TextInput
                label="API Token"
                value={API}
                style={{ shadowColor: '#000000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.30, shadowRadius: 3, elevation: 3, marginVertical: 10 }}
                onChangeText={text => setAPI(text)}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={LongitudinalChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setLongitudinalChecked(!LongitudinalChecked);
                  }}
                />
                <Text>Longitudinal project </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={RepeatableChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setRepeatableChecked(!RepeatableChecked);
                  }}
                />
                <Text>Repeatable instruments</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox
                  status={UploadChecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setUploadChecked(!UploadChecked);
                  }}
                />
                <Text>Upload on Save</Text>
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