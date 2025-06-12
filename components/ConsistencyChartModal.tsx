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

export default function ConsistencyChartModal({ isVisible, message, onClose }: Props) {
  const router = useRouter();
  const { consistencyThreshold } = useGlobalVariables();

  const handleClose = () => {
    onClose();
    router.push('/');
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={Style.modalOverlay}>
        <View style={Style.modalContent}>
          <View style={{ alignContent: 'flex-end', alignItems: 'flex-end', width: '100%' }}>
            <IconButton icon="close" size={30} onPress={handleClose} />
          </View>
          <Text style={Style.heading}>Consistency Analysis</Text>
          <Text style={{ marginHorizontal: 15, marginVertical: 20 }}>A tap is considered consistent if it falls within <Text style={{ fontWeight: "bold" }}>{consistencyThreshold}%</Text> of the median time interval between taps.</Text>
          <View>
            <ConsistencyChart showLabels />

          </View>
        </View>
      </View>
    </Modal >
  );
}

