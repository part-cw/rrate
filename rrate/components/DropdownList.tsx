import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { GlobalStyles as Style } from '@/app/styles';

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
    <View style={Style.componentContainer}>

      <TouchableOpacity style={Style.dropdownBox} onPress={toggleDropdown}>
        <Text>{selected}</Text>
        <MaterialIcons name={open ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={24} />
      </TouchableOpacity>


      {open && (
        <View style={Style.dropdownList}>
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={Style.dropdownItem}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled
          />
        </View>
      )}
    </View>
  );
}

