import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropdownList from '../components/DropdownList';
import { GlobalStyles as Style } from '@/assets/styles';
import { Button } from 'react-native-paper';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import ConsistencyChart from '../components/ConsistencyChart';
import { useGlobalVariables } from './globalContext';
import { useTranslation } from '@/hooks/useTranslation';

const ages = ['default', '<2 months', '2–12 months', '>1 year'];


export default function Results() {
  const router = useRouter();
  const { t } = useTranslation();

  const [age, setAge] = useState('');
  const { rrate, tapTimestamps } = useGlobalVariables();
  const [rrateConfirmed, setRRateConfirmed] = useState<boolean>(false);

  let rrateColour;

  if (age === '<2 months') {
    if (rrate > 60) {
      rrateColour = Theme.colors.tertiary;
    } else {
      rrateColour = Theme.colors.secondary;
    }
  } else if (age === '2–12 months') {
    if (rrate > 50) {
      rrateColour = Theme.colors.tertiary;
    } else {
      rrateColour = Theme.colors.secondary;
    }
  } else if (age === '>1 year') {
    if (rrate > 40) {
      rrateColour = Theme.colors.tertiary;
    } else {
      rrateColour = Theme.colors.secondary;
    }
  }


  return (
    <View style={Style.screenContainer}>
      <View style={[Style.floatingContainer, { flexDirection: 'row' }]}>
        <View style={Style.leftColumn}>
          <Text style={[Style.rateValue, { color: rrateColour }]}>{rrate}</Text>
        </View>

        <View style={Style.rightColumn}>
          <Text style={Style.labelMain}>{t("RRATE")}</Text>
          <Text style={Style.labelSub}>{t("RRATE_UNIT")}</Text>

          <View style={Style.divider} />

          <View style={Style.dropdownContainer}>
            <Text style={Style.ageLabel}>Age</Text>
            <View style={{ width: 150 }}>
              <DropdownList label="" data={ages} onSelect={setAge} />
            </View>
          </View>
        </View>
      </View>

      <ConsistencyChart showInfoButton />

      {rrateConfirmed ? (

        <View style={[Style.floatingContainer, { backgroundColor: "#3F3D3D", justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
            <Button
              icon="location-exit"
              mode="contained"
              buttonColor={Theme.colors.tertiary}
              onPress={() => console.log('Pressed')}
              style={{ paddingHorizontal: 20, marginRight: 10 }}>
              {t("EXIT")}
            </Button>
            <Button
              icon="arrow-u-right-bottom"
              buttonColor={Theme.colors["neutral-bttn"]}
              mode="contained"
              onPress={() => router.push("/")}
              style={{ paddingHorizontal: 20, marginLeft: 10 }}>
              {t("RESTART")}
            </Button>
          </View>
        </View>

      ) : (
        <View style={[Style.floatingContainer, { backgroundColor: "#3F3D3D", justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontWeight: 'bold', color: "#ffffff" }}>{t("RR_MATCH")} </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
            <Button
              icon="check"
              mode="contained"
              buttonColor={Theme.colors.secondary}
              onPress={() => setRRateConfirmed(true)}
              style={{ paddingHorizontal: 30, marginRight: 10 }}>
              {t("YES")}
            </Button>
            <Button
              icon="close"
              buttonColor={Theme.colors.tertiary}
              mode="contained"
              onPress={() => router.push("/")}
              style={{ paddingHorizontal: 30, marginLeft: 10 }}>
              {t("NO")}
            </Button>
          </View>
        </View>)}

    </View >
  );
}
