import { Modal, View, Text, StyleSheet } from "react-native";
import { PropsWithChildren } from 'react';
import { GlobalStyles as Style } from "@/assets/styles";
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "@/assets/theme";
import { useRouter } from "expo-router";

type Props = PropsWithChildren<{
  isVisible: boolean;
  message: string;
  onClose: () => void;
}>;

export default function ConsistencyChartModal({ isVisible, message, onClose }: Props) {
  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={Style.modalOverlay}>
        <View style={Style.modalContent}>
          <MaterialCommunityIcons
            name="alert"
            size={40}
            color={'#000000'}
          />
          <Text style={Style.message}>{message}</Text>
          <Text style={Style.subtext}>Please try again.</Text>
          <View style={Style.buttonRow}>
            <Button
              icon="arrow-u-right-bottom"
              mode="contained"
              buttonColor={Theme.colors.tertiary}
              onPress={handleClose}
            >
              Retry
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

