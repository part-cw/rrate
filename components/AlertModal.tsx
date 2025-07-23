import { Modal, View, Text } from "react-native";
import { PropsWithChildren, useEffect } from 'react';
import { GlobalStyles as Style } from "@/assets/styles";
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "@/assets/theme";
import { useRouter } from "expo-router";
import useTranslation from '../utils/useTranslation';

type Props = PropsWithChildren<{
  isVisible: boolean;
  message: string;
  onClose: () => void;
}>;

// Pop-up modal alert screen
export default function AlertModal({ isVisible, message, onClose }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleRetry = () => {
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
            style={{ padding: 20 }}
          />
          <Text>{message}</Text>
          <View style={Style.buttonRow}>
            <Button
              icon="arrow-u-right-bottom"
              mode="contained"
              buttonColor={Theme.colors.tertiary}
              onPress={handleRetry}
            >
              {t("RETRY")}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

