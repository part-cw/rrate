import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const values = [3, 4, 5, 6];

export default function Slider() {
  const [selectedValue, setSelectedValue] = useState(5);
  const selectedIndex = values.indexOf(selectedValue);

  const screenWidth = Dimensions.get('window').width;
  const sliderWidth = 250;
  const stepWidth = sliderWidth / (values.length - 1);

  const animatedLeft = useRef(new Animated.Value(selectedIndex * stepWidth)).current;

  useEffect(() => {
    Animated.timing(animatedLeft, {
      toValue: selectedIndex * stepWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedValue]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.triangle,
          {
            left: animatedLeft,
            transform: [{ translateX: -1 }], // center the triangle
          },
        ]}
      />

      <View style={styles.sliderLine} />
      <View style={styles.numberRow}>
        {values.map((val) => (
          <TouchableOpacity
            key={val}
            onPress={() => setSelectedValue(val)}
            style={[styles.step, { width: stepWidth }]}
          >
            <Text style={styles.label}>{val}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderLine: {
    height: 2,
    backgroundColor: 'black',
    width: 290,
    position: 'absolute',
    top: 10,
  },
  triangle: {
    position: 'absolute',
    top: 7,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'black',
  },
  numberRow: {
    flexDirection: 'row',
    marginTop: 20
  },
  step: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16
  },
});
