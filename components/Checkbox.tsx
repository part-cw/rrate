import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlobalStyles as Style } from '@/assets/styles';

type Props = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

// Checkbox component
export default function Checkbox({ label, checked, onChange }: Props) {
  return (
    <Pressable style={Style.checkboxContainer} onPress={onChange}>
      <View style={[Style.checkbox, checked && Style.checked]}>
        {checked && <MaterialIcons name="check" size={18} color="white" />}
      </View>
      <Text style={{ fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}

