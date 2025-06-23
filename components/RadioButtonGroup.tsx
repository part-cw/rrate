import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from '../assets/theme';

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selected: string;
  onSelect: (value: string) => void;
};

// Displays a group of radio buttons
export default function RadioButtonGroup({ options, selected, onSelect }: Props) {
  return (
    <View>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onSelect(option.value)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
          }}
        >
          <MaterialIcons
            name={selected === option.value ? 'radio-button-checked' : 'radio-button-unchecked'}
            size={24}
            color={selected === option.value ? Theme.colors.primary : '#999'}
          />
          <Text style={{ marginLeft: 10 }}>{option.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}
