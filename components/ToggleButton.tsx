import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { GlobalStyles as Style } from '../assets/styles';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ToggleButtonProps {
  values: string[];
  selectedValue: string;
  iconNames?: string[];
  onChange: (value: string) => void;
}

export default function ToggleButton({ values, selectedValue, iconNames, onChange }: ToggleButtonProps) {
  return (
    <View style={Style.toggleButtonContainer}>
      {values.map((option, index) => {
        const selected = selectedValue === option;
        const isFirst = index === 0;
        const isLast = index === values.length - 1;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              Style.toggleButton,
              selected ? Style.activeToggleButton : Style.inactiveToggleButton,
            ]}
          >
            {iconNames && (
              <MaterialCommunityIcons
                name={iconNames[index] as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                size={20}
                color={selected ? '#fff' : '#000'}
                style={{ padding: 0 }}
              />
            )}
            <Text style={[Style.text, selected ? Style.activeText : Style.inactiveText]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}


