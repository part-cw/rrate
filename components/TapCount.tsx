import { Text, View } from "react-native";
import { GlobalStyles as Style } from "@/assets/styles";

type TapCountProps = {
  tapCount: number;
};

// TapCount displays a blue circle for each tap on the Tap on Inhalation button.
export default function TapCount({ tapCount }: TapCountProps) {

  return (
    <View style={Style.floatingContainer}>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        Tap Count
      </Text>
      <View style={Style.circleRow}>
        {Array.from({ length: tapCount }).map((_, index) => (
          <View
            key={index}
            style={[
              Style.tapCircle,
              // { backgroundColor: index < tapCount ? '#4267BC' : '#D3D3D3' }
              { backgroundColor: '#4267BC' }
            ]}
          />
        ))}
      </View>
    </View >
  )
}