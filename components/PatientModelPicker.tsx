import { View, Text, Image } from 'react-native';
import { GlobalStyles as Style } from '@/assets/styles';
import { IconButton } from 'react-native-paper';
import { useSettings } from '@/app/SettingsContext';
import React, { useState } from 'react';



type BabyAnimationOption = 1 | 2 | 3 | 4 | 5 | 6;

export default function PatientModelPicker() {
  const [currentBaby, setCurrentBaby] = useState(1);
  const { setBabyAnimation } = useSettings();

  const babyImages = {
    1: require('@/assets/babyAnimation/Baby1Static.png'),
    2: require('@/assets/babyAnimation/Baby2Static.png'),
    3: require('@/assets/babyAnimation/Baby3Static.png'),
    4: require('@/assets/babyAnimation/Baby4Static.png'),
    5: require('@/assets/babyAnimation/Baby5Static.png'),
    6: require('@/assets/babyAnimation/Baby6Static.png'),
  } as const;

  const imageSource = babyImages[currentBaby as BabyAnimationOption];

  // Move to the next baby model
  const handleNext = () => {
    if (currentBaby < 6) {
      setCurrentBaby(currentBaby + 1);
      setBabyAnimation((currentBaby + 1) as BabyAnimationOption);
    }
  }

  // Move to the previous baby model
  const handlePrev = () => {
    if (currentBaby > 1) {
      setCurrentBaby(currentBaby - 1);
      setBabyAnimation((currentBaby - 1) as BabyAnimationOption);
    }
  }



  return (
    <View style={Style.floatingContainer} >
      <Text style={Style.heading}> Patient Model </Text>
      <View style={{ paddingTop: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={imageSource}
            style={{ width: 170, height: 190, resizeMode: 'contain' }}
          />
        </View>


        <View style={[Style.componentContainer, {
          paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', gap: 14, alignItems: 'center', shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderRadius: 10,
        }]}>
          <IconButton icon="arrow-left-drop-circle-outline" size={30} disabled={currentBaby == 1} onPress={handlePrev} />
          <Text> Baby {currentBaby} </Text>
          <IconButton icon="arrow-right-drop-circle-outline" size={30} disabled={currentBaby == 6} onPress={handleNext} />
        </View>
      </View>


    </View >
  )


}