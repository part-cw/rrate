import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlobalStyles as Style } from '@/assets/styles';
import { Theme } from '@/assets/theme';

// Dropdown that allows user to select from a list of options.
export default function DropdownList({ label, data, onSelect }: { label: string; data: string[], onSelect?: (value: string) => void }) {
  const [selected, setSelected] = useState(label);
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(prev => !prev);

  const handleSelect = (val: string) => {
    setSelected(val);
    setOpen(false);
    if (onSelect) onSelect(val);
  };

  return (
    <View>
      <TouchableOpacity style={Style.dropdownBox} onPress={toggleDropdown}>
        <Text style={[Style.text, { color: selected == "Set Age" ? Theme.colors['neutral-bttn'] : "black" }]}>{selected}</Text>
        <MaterialIcons name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} />
      </TouchableOpacity>

      {open && (
        <View style={Style.dropdownList}>
          {data.map((item) => (
            <TouchableOpacity key={item} onPress={() => handleSelect(item)} style={Style.dropdownItem}>
              <Text style={Style.text}>{item}</Text>
            </TouchableOpacity>
          ))}

        </View>
      )}
    </View>
  );
}

