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

export default function AlertModal({ isVisible, message, onClose }: Props) {
  const router = useRouter();

  const handleRetry = () => {
    onClose();
    router.push('/');
  };

  const handleSettings = () => {
    onClose();
    router.push('/results');
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
              onPress={handleRetry}
            >
              Retry
            </Button>
            <Button
              icon="minus-circle-outline"
              buttonColor={Theme.colors["neutral-bttn"]}
              mode="contained"
              onPress={handleSettings}
            >
              Settings
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

