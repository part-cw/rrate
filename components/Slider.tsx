import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { GlobalStyles as Style } from '../assets/styles';

type SliderProps = {
  values: string[];
  defaultValue: string;
  onSelect?: (value: string) => void; // 👈 new
};


export default function Slider({ values, defaultValue }: SliderProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const selectedIndex = values.indexOf(selectedValue);

  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = 250;
  const stepWidth = sliderWidth / (values.length - 1);

  const animatedLeft = useRef(new Animated.Value(selectedIndex * stepWidth)).current;

  useEffect(() => {
    Animated.timing(animatedLeft, {
      toValue: selectedIndex * stepWidth + 15, // Adjusted to center triangle and label
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedValue]);

  return (
    <View style={Style.container}>
      <Animated.View
        style={[
          Style.triangle,
          {
            left: animatedLeft,
            transform: [{ translateX: -1 }],
          },
        ]}
      />

      <View style={Style.sliderLine} />
      <View style={Style.numberRow}>
        {values.map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => setSelectedValue(val)}
            style={[Style.step, { width: stepWidth }]}
          >
            <Text
              style={[
                Style.label,
                val === selectedValue && { fontWeight: 'bold' }
              ]}
            >
              {val}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}