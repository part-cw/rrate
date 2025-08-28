import { Modal, View, Text } from "react-native";
import { PropsWithChildren, use } from 'react';
import { GlobalStyles as Style } from "@/assets/styles";
import { IconButton } from 'react-native-paper';
import { useRouter } from "expo-router";
import useTranslation from '../utils/useTranslation';
import ConsistencyChart from "./ConsistencyChart";
import { useGlobalVariables } from "../utils/globalContext";

type Props = PropsWithChildren<{
  isVisible: boolean;
  age?: string;
  onClose: () => void;
}>;

// Pop-up modal dialog that displays the consistency chart and a description of how consistency is calculated.
export default function ConsistencyChartModal({ isVisible, age, onClose }: Props) {
  const router = useRouter();
  const { t } = useTranslation();
  const { consistencyThreshold } = useGlobalVariables();

  const rawTranslation = t("CONSISTENCY_DESC");
  const message = rawTranslation.replace("{threshold}", consistencyThreshold.toString());

  const handleClose = () => {
    onClose();
    router.push({ pathname: '/results', params: { age } }); // Pass age back to results screen to prevent reset 
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={Style.modalOverlay}>
        <View style={Style.modalContent}>
          <IconButton icon="close" size={30} style={{
            position: 'absolute',
            top: 2,
            right: 5,
            zIndex: 1,
          }} onPress={handleClose} />
          <Text style={[Style.heading, { paddingTop: 15 }]}>{t("CONSISTENCY_ANALYSIS")}</Text>
          <Text style={[Style.text, { marginHorizontal: 15, marginVertical: 20, textAlign: 'center' }]}>{message}</Text>
          <View style={{ marginVertical: 30 }}>
            <ConsistencyChart showLabels />

          </View>
        </View>
      </View>
    </Modal >
  );
}

