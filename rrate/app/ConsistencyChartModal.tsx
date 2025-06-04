import { View, Text, Modal, Pressable } from 'react-native';
import { PropsWithChildren } from 'react';
import { MaterialIcons } from '@expo/vector-icons';


type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;

export default function ConsistencyChartModal({ isVisible, children, onClose }: Props) {
  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View>
          <View>
            <Text>Choose a sticker</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="#fff" size={22} />
            </Pressable>
          </View>
          {children}
        </View>
      </Modal>
    </View>
  );
}