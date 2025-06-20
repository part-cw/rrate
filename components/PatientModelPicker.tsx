import { View, Text, Image, Pressable, useWindowDimensions } from 'react-native';
import { GlobalStyles as Style } from '@/assets/styles';
import { IconButton } from 'react-native-paper';
import { useGlobalVariables } from '@/app/globalContext';
import React, { useState } from 'react';
import useTranslation from '@/hooks/useTranslation';

type BabyAnimationOption = 1 | 2 | 3 | 4 | 5 | 6;

// Allows user to select from one of six baby animations.
export default function PatientModelPicker() {
  const { babyAnimation, setBabyAnimation } = useGlobalVariables();
  const [currentBaby, setCurrentBaby] = useState(babyAnimation);
  const { t } = useTranslation();

  const { width } = useWindowDimensions();
  const dynamicPadding = width > 400 ? 30 : 20;

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
      setCurrentBaby((currentBaby + 1) as BabyAnimationOption);
      setBabyAnimation((currentBaby + 1) as BabyAnimationOption);
    }
  }

  // Move to the previous baby model
  const handlePrev = () => {
    if (currentBaby > 1) {
      setCurrentBaby((currentBaby - 1) as BabyAnimationOption);
      setBabyAnimation((currentBaby - 1) as BabyAnimationOption);
    }
  }

  return (
    <View style={[Style.floatingContainer, { padding: dynamicPadding }]} >
      <Text style={Style.heading}> Patient Model </Text>
      <View style={{ paddingTop: 30 }}>
        <View style={{ alignItems: 'center' }}>
          <Image
            source={imageSource}
            style={{ width: 170, height: 240, resizeMode: 'contain' }}
          />
        </View>

        <View style={{
          paddingHorizontal: 30, flexDirection: 'row', justifyContent: 'space-between', gap: 14, alignItems: 'center', shadowColor: '#000',
          backgroundColor: "#f5f6f7",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          borderRadius: 10,
        }}>
          <Pressable onPress={handlePrev} style={{ padding: 10 }}>
            <IconButton icon="arrow-left-drop-circle-outline" size={40} disabled={currentBaby == 1} />
          </Pressable>
          <Text> Baby {currentBaby} </Text>
          <Pressable onPress={handleNext} style={{ padding: 10 }}>
            <IconButton icon="arrow-right-drop-circle-outline" size={40} disabled={currentBaby == 6} />
          </Pressable>
        </View>
      </View>


    </View >
  )


}