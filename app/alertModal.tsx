import { Modal, View, Text } from "react-native";
import { PropsWithChildren } from 'react';
import { GlobalStyles as Style } from "@/assets/styles";
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Theme } from "@/assets/theme";
import { useRouter } from "expo-router";

type Props = PropsWithChildren<{
  isVisible: boolean;
  textLine1: String;
  textLine2: String;
  onClose: () => void;
}>;

export default function AlertModal({ isVisible, textLine1, textLine2, onClose, children }: Props) {

  const router = useRouter();

  return (
    <View style={Style.screenContainer}>
      <Modal animationType="slide" transparent={true} visible={isVisible}>
        <View>
          <View >
            <MaterialCommunityIcons
              name="alert"
              size={40}
              color={'#000000'}
            />
            <Text>{textLine1}</Text>
            <Text>{textLine2}</Text>
            <View style={[Style.componentContainer, { width: 350, flexDirection: 'row', justifyContent: 'space-between', gap: 14 }]}>
              <Button
                icon="arrow-u-right-bottom"
                mode="contained"
                buttonColor={Theme.colors.tertiary}
                onPress={() => router.push('/')}
              >
                Retry
              </Button>
              <Button icon="minus-circle-outline"
                buttonColor={Theme.colors["neutral-bttn"]}
                mode="contained"
                onPress={() => router.push("/results")}
              >
                Settings
              </Button>
            </View>
          </View>
          {children}
        </View>
      </Modal>
    </View>
  )

};