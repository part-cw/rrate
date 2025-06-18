import { Modal, View, Text } from "react-native";
import { PropsWithChildren } from 'react';
import { GlobalStyles as Style } from "@/assets/styles";
import { IconButton } from 'react-native-paper';
import { Theme } from "@/assets/theme";
import { useRouter } from "expo-router";
import ConsistencyChart from "./ConsistencyChart";
import { useGlobalVariables } from "@/app/globalContext";

type Props = PropsWithChildren<{
  isVisible: boolean;
  message: string;
  onClose: () => void;
}>;

// Pop-up modal dialog that displays the consistency chart and a description of how consistency is calculated.
export default function ConsistencyChartModal({ isVisible, message, onClose }: Props) {
  const router = useRouter();
  const { consistencyThreshold } = useGlobalVariables();

  const handleClose = () => {
    onClose();
    router.push('/results');
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={Style.modalOverlay}>
        <View style={Style.modalContent}>

          <IconButton icon="close" size={30} style={{
            position: 'absolute',
            top: 2,
            right: 5,
            zIndex: 1, // just in case other elements try to cover it
          }} onPress={handleClose} />
          <Text style={Style.heading}>Consistency Analysis</Text>
          <Text style={{ marginHorizontal: 15, marginVertical: 20 }}>A tap is considered consistent if it falls within <Text style={{ fontWeight: "bold" }}>{consistencyThreshold}%</Text> of the median time interval between taps.</Text>
          <View style={{ marginVertical: 30 }}>
            <ConsistencyChart showLabels />

          </View>
        </View>
      </View>
    </Modal >
  );
}

