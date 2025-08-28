import { Text, View } from "react-native";
import { GlobalStyles as Style } from "@/assets/styles";
import useTranslation from "../utils/useTranslation";

type TapCountProps = {
  tapCount: number;
};

// TapCount displays a blue circle for each tap on the Tap on Inhalation button.
export default function TapCount({ tapCount }: TapCountProps) {
  const { t } = useTranslation();

  return (
    <View style={Style.floatingContainer}>
      <Text style={{ fontWeight: 'bold', textAlign: 'center', userSelect: "none" }}>
        {t("TAP_COUNT")}
      </Text>
      <View style={Style.circleRow}>
        {tapCount > 0 ? (
          Array.from({ length: tapCount }).map((_, index) => (
            <View
              key={index}
              style={[
                Style.tapCircle,
                { backgroundColor: '#4267BC' }
              ]}
            />
          ))
        )
          : // If no taps, have a invisible placeholder circle to maintain size of component
          (<View
            style={[
              Style.tapCircle,
              { backgroundColor: '#f5f6f7', borderColor: '#f5f6f7' }
            ]}
          />)}
      </View>
    </View >
  )
}