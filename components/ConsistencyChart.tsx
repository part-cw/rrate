import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Line } from 'react-native-svg';
import { useSettings } from '../app/SettingsContext';
import { GlobalStyles as Style } from '@/assets/styles';

export default function ConsistencyChart() {
  const { consistencyThreshold, tapTimestamps } = useSettings();
  const [modalVisible, setModalVisible] = useState(false);

  const chartWidth = 350;
  const chartHeight = 100;

  const tapIntervals = tapTimestamps.slice(1).map((t, i) => t - tapTimestamps[i]);
  console.log(tapIntervals);
  const median = getMedian(tapIntervals);
  const threshold = (consistencyThreshold / 100) * median;

  const pointSpacing = chartWidth / Math.max(1, tapIntervals.length) - 15; // leaves padding on the right
  const maxDeviation = Math.max(...tapIntervals.map(i => Math.abs(i - median)), threshold);

  const getY = (interval: number) => {
    const offset = interval - median;
    return (
      chartHeight / 2 +
      (offset / maxDeviation) * (chartHeight / 2 - 10)
    );
  };

  const points = tapTimestamps.map((_, i) => {
    const x = i * pointSpacing + (i === 0 ? 10 : 0);

    let y: number;
    let isConsistent: boolean;

    if (i === 0) {
      y = getY(median); // anchor first point to the median line
      isConsistent = true; // neutral
    } else {
      const interval = tapIntervals[i - 1];
      y = getY(interval);
      isConsistent = Math.abs(interval - median) <= threshold;
    }

    return { x, y, isConsistent };
  });
  console.log("Points");
  console.log(points);

  return (
    <View style={{ backgroundColor: "fff", margin: 20, height: chartHeight, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 2, height: 3 } }}>
      {/* Background Threshold Band */}
      <View style={{ position: 'absolute', top: '30%', left: 0, right: 0, height: "40%", backgroundColor: '#E4E4E4', borderRadius: 10, zIndex: 0 }} />

      {/* SVG Chart */}
      <Svg width={chartWidth} height={chartHeight} style={{ alignSelf: 'center', zIndex: 1 }}>
        {points.map((point, i) => {
          const next = points[i + 1];
          return (
            next && (
              <Line
                key={`line-${i}`}
                x1={point.x}
                y1={point.y}
                x2={next.x}
                y2={next.y}
                stroke="black"
                strokeWidth={2}
              />
            )
          );
        })}

        {points.map((point, i) => (
          <Circle
            key={`dot-${i}`}
            cx={point.x}
            cy={point.y}
            r={8}
            fill={point.isConsistent ? '#FFFFFF' : '#E63946'}
            stroke="#000000"
            strokeWidth={2}
          />
        ))}
      </Svg>

      {/* Info Button */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{
          position: 'absolute',
          right: -10,
          top: '26%',
          backgroundColor: 'white',
          borderRadius: 30,
          padding: 5,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
        }}
      >
        <MaterialCommunityIcons name="information-outline" size={35} color="black" />
      </TouchableOpacity>

      {/* Modal Dialog */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={Style.screenContainer}>
          <View style={[Style.componentContainer, { backgroundColor: 'white', padding: 20, borderRadius: 12 }]}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Consistency Chart</Text>
            <Text style={{ marginBottom: 20 }}>
              Each circle represents the interval between taps. Red indicates an interval that falls outside the consistency threshold ({consistencyThreshold}% from the median). White means it's within threshold.
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'blue', textAlign: 'right' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getMedian(arr: number[]) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}
