import { Modal, View, Text } from "react-native";
import { PropsWithChildren } from 'react';
import { GlobalStyles as Style } from "@/assets/styles";
import { IconButton } from 'react-native-paper';
import { useRouter } from "expo-router";
import ConsistencyChart from "./ConsistencyChart";
import { useGlobalVariables } from "@/utils/globalContext";

type Props = PropsWithChildren<{
  isVisible: boolean;
  message: string;
  onClose: () => void;
}>;

// Pop-up modal dialog that displays the consistency chart and a description of how consistency is calculated.
export default function ConsistencyChartModal({ isVisible, onClose }: Props) {
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
            zIndex: 1,
          }} onPress={handleClose} />
          <Text style={[Style.heading, { paddingTop: 15 }]}>Consistency Analysis</Text>
          <Text style={{ marginHorizontal: 15, marginVertical: 20, textAlign: 'center' }}>A tap is consistent if it falls within <Text style={{ fontWeight: "bold" }}>{consistencyThreshold}%</Text> of the median interval.
            {'\n'}The grey area shows this range.</Text>
          <View style={{ marginVertical: 30 }}>
            <ConsistencyChart showLabels />

          </View>
        </View>
      </View>
    </Modal >
  );
}

