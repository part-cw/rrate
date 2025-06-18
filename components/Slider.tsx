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
  onSelect?: (value: string) => void;
};


export default function Slider({ values, defaultValue, onSelect }: SliderProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const selectedIndex = values.indexOf(selectedValue);

  const sliderWidth = 250;
  const stepWidth = sliderWidth / (values.length - 1);

  const trianglePosition = useRef(new Animated.Value(selectedIndex * stepWidth)).current;

  useEffect(() => {
    Animated.timing(trianglePosition, {
      toValue: selectedIndex * stepWidth, // Adjusted to center triangle and label
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
            left: trianglePosition,
            transform: [{ translateX: + 3 }],
          },
        ]}
      />

      <View style={Style.sliderLine} />
      <View style={Style.numberRow}>
        {values.map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => {
              setSelectedValue(val);
              if (onSelect) onSelect(val);
            }}
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