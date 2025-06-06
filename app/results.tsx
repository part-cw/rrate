import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DropdownList from '../components/DropdownList';
import { GlobalStyles as Style } from '@/assets/styles';
import { Button } from 'react-native-paper';
import { Theme } from '../assets/theme';
import { useRouter } from 'expo-router';
import ConsistencyChartModal from '@/app/ConsistencyChartModal';
import ConsistencyChart from '@/components/ConsistencyChart';
import { useSettings } from './SettingsContext';

const ages = ['default', '<2 months', '2–12 months', '>1 year'];


export default function RespiratoryRateCard() {
  const [age, setAge] = useState('');
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { rrate } = useSettings();

  const onOpenChart = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

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
          <Text style={Style.labelMain}>Respiratory Rate</Text>
          <Text style={Style.labelSub}>(breaths/min)</Text>

          <View style={Style.divider} />

          <View style={Style.dropdownContainer}>
            <Text style={Style.ageLabel}>Age</Text>
            <View style={{ width: 170 }}>
              <DropdownList label="" data={ages} onSelect={setAge} />
            </View>
          </View>
        </View>
      </View>

      <ConsistencyChart tapCount={3} />

      <View style={[Style.floatingContainer, { backgroundColor: "#3F3D3D", justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontWeight: 'bold', color: "#ffffff" }}>Does the breathing rate match the patient? </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }} >
          <Button
            icon="check"
            mode="contained"
            buttonColor={Theme.colors.secondary}
            onPress={() => console.log('Pressed')}
            style={{ paddingHorizontal: 30, marginRight: 10 }}>
            Yes
          </Button>
          <Button
            icon="close"
            buttonColor={Theme.colors.tertiary}
            mode="contained"
            onPress={() => router.push("/")}
            style={{ paddingHorizontal: 30, marginLeft: 10 }}>
            No</Button>
        </View>
      </View>
      <ConsistencyChartModal isVisible={isModalVisible} onClose={onModalClose} />

    </View >
  );
}
