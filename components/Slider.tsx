// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Animated } from 'react-native';
// import { GlobalStyles as Style } from '../assets/styles';

// type SliderProps = {
//   values: string[];
//   defaultValue: string;
//   onSelect?: (value: string) => void;
// };

// // Allows the user to select from a range of values by tapping on a slider. 
// export default function Slider({ values, defaultValue, onSelect }: SliderProps) {
//   const [selectedValue, setSelectedValue] = useState(defaultValue);
//   const selectedIndex = values.indexOf(selectedValue);

//   const sliderWidth = 230; // static width
//   const stepWidth = sliderWidth / (values.length - 1);

//   const trianglePosition = useRef(new Animated.Value(selectedIndex * stepWidth)).current;

//   useEffect(() => {
//     Animated.timing(trianglePosition, {
//       toValue: selectedIndex * stepWidth, // Adjusted to center triangle and label
//       duration: 200,
//       useNativeDriver: false,
//     }).start();
//   }, [selectedValue]);

//   return (
//     <View style={Style.container}>
//       <Animated.View
//         style={[
//           Style.triangle,
//           {
//             left: trianglePosition,
//             transform: [{ translateX: + 3 }],
//           },
//         ]}
//       />

//       <View style={Style.sliderLine} />
//       <View style={Style.numberRow}>
//         {values.map((val) => (
//           <TouchableOpacity
//             key={val}
//             onPress={() => {
//               setSelectedValue(val);
//               if (onSelect) onSelect(val);
//             }}
//             style={[Style.step, { width: stepWidth }]}
//           >
//             <Text
//               style={[
//                 Style.label,
//                 val === selectedValue && { fontWeight: 'bold' }
//               ]}
//             >
//               {val}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </View>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Animated,
  GestureResponderEvent
} from 'react-native';
import Slider from '@react-native-community/slider';
import { GlobalStyles as Style } from '../assets/styles';

type SliderProps = {
  values: string[];
  defaultValue: string;
  onSelect?: (value: string) => void;
};

export default function SettingsSlider({ values, defaultValue, onSelect }: SliderProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const selectedIndex = values.indexOf(selectedValue);

  const sliderWidth = 230;
  const stepWidth = sliderWidth / (values.length - 1);
  const trianglePosition = useRef(new Animated.Value(selectedIndex * stepWidth)).current;

  const handleLinePress = (event: GestureResponderEvent) => {
    const tapX = event.nativeEvent.locationX;
    const index = Math.round(tapX / stepWidth);
    const clampedIndex = Math.max(0, Math.min(values.length - 1, index));
    const newValue = values[clampedIndex];

    setSelectedValue(newValue);
    if (onSelect) onSelect(newValue);
  };

  useEffect(() => {
    Animated.timing(trianglePosition, {
      toValue: selectedIndex * stepWidth,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedValue]);

  return (
    <View style={Style.container}>
      <Slider
        style={{ width: 200, height: 40 }}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
      />
    </View>
  );

  // return (
  //   <View style={Style.container}>
  //     <Animated.View
  //       style={[
  //         Style.triangle,
  //         {
  //           left: trianglePosition,
  //           transform: [{ translateX: +3 }],
  //         },
  //       ]}
  //     />

  //     <Pressable onPress={handleLinePress}>
  //       <View style={[Style.sliderLine, { width: sliderWidth }]} />
  //     </Pressable>

  //     <View style={Style.numberRow}>
  //       {values.map((val) => (
  //         <TouchableOpacity
  //           key={val}
  //           onPress={() => {
  //             setSelectedValue(val);
  //             if (onSelect) onSelect(val);
  //           }}
  //           style={[Style.step, { width: stepWidth }]}
  //         >
  //           <Text
  //             style={[
  //               Style.label,
  //               val === selectedValue && { fontWeight: 'bold' },
  //             ]}
  //           >
  //             {val}
  //           </Text>
  //         </TouchableOpacity>
  //       ))}
  //     </View>
  //   </View>
  // );
}
