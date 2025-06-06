import { View, Text } from 'react-native';
import { GlobalStyles as Style } from '@/assets/styles';

export default function ConsistencyChart({ tapCount }: { tapCount: number }) {
  return (
    <View >
      <View style={[Style.floatingContainer, { zIndex: 2 }]}>
        <View style={Style.outsideThreshold} />
        <View style={Style.insideThreshold} />
        <View style={Style.outsideThreshold} />
      </View>
      <View style={{ zIndex: 1 }}>

      </View>
    </View >
  );
}
