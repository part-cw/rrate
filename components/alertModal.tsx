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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <MaterialCommunityIcons
            name="alert"
            size={40}
            color={'#000000'}
          />
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.subtext}>Please try again.</Text>
          <View style={styles.buttonRow}>
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

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    marginVertical: 8,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
    justifyContent: 'space-between',
  },
});
