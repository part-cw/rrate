import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Line } from 'react-native-svg';
import { useGlobalVariables } from '../app/globalContext';
import { GlobalStyles as Style } from '@/assets/styles';
import useTranslation from '@/hooks/useTranslation';
import ConsistencyChartModal from './ConsistencyChartModal';
import * as consistencyFunctions from '../utils/consistencyFunctions';

// Show info button on results page and labels on modal dialog
type ConsistencyChartProps = {
  showInfoButton?: boolean;
  showLabels?: boolean;
};

export default function ConsistencyChart({ showInfoButton, showLabels }: ConsistencyChartProps) {
  const { consistencyThreshold, tapTimestamps, tapCountRequired, rrate } = useGlobalVariables();
  const [modalVisible, setModalVisible] = useState(false);

  const chartWidth = 350;
  const chartHeight = 90;
  const chartPadding = 10;

  const tapLimit = tapCountRequired; // number of taps to consider
  const recentTaps = tapTimestamps.slice(-tapLimit);
  const recentIntervals = recentTaps.slice(1).map((t, i) => t - recentTaps[i]);

  const median = getMedian(recentIntervals);
  const threshold = (consistencyThreshold / 100) * median;

  // Use 1.5x threshold to give room for visualization
  const minDisplay = median - 1.5 * threshold;
  const maxDisplay = median + 1.5 * threshold;

  const getY = (interval: number) => {
    const clamped = Math.max(minDisplay, Math.min(maxDisplay, interval));
    const normalized = (clamped - minDisplay) / (maxDisplay - minDisplay);
    return chartPadding + normalized * (chartHeight - 2 * chartPadding);
  };

  const grayTop = getY(median - threshold);
  const grayBottom = getY(median + threshold);
  const grayHeight = grayBottom - grayTop;


  // DATA POINTS
  const pointSpacing = chartWidth / Math.max(1, tapTimestamps.length) - 2; // leaves padding on the right

  const points = tapTimestamps.map((_, i) => {
    const x = i * pointSpacing + (i === 0 ? chartPadding : 0); // adds padding to the left of the first point

    let y: number;
    let isConsistent: boolean;

    if (i === 0) {
      y = getY(median); // anchor first point to the median line
      isConsistent = true; // neutral
    } else {
      const interval = tapTimestamps[i] - tapTimestamps[i - 1];
      y = getY(interval);
      isConsistent = Math.abs(interval - median) <= threshold;

    }

    return { x, y, isConsistent };
  });

  // Returns the median of an array 
  function getMedian(arr: number[]) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  return (
    <View style={{ backgroundColor: "fff", height: chartHeight, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 2, height: 3 } }}>
      {/* Background Threshold Band */}
      <View
        style={{
          position: 'absolute',
          top: grayTop,
          height: grayHeight,
          left: 0,
          right: 0,
          backgroundColor: '#E4E4E4',
          borderRadius: 10,
          zIndex: 0,
        }}
      />

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
            r={7}
            fill={point.isConsistent ? '#FFFFFF' : '#E63946'}
            stroke="#000000"
            strokeWidth={1}
          />
        ))}
      </Svg>

      {/* Show info button when viewing the consistency chart on the results page */}
      {(showInfoButton && rrate > 0) && (
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            position: 'absolute',
            right: 0,
            top: 25,
            backgroundColor: 'white',
            borderRadius: 30,
            padding: 5,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 3,
            zIndex: 2,
          }}
        >
          <MaterialCommunityIcons name="information-outline" size={40} color="black" />
        </TouchableOpacity>
      )}

      {/* Show labels when viewing the consistency chart on the modal dialog page */}
      {showLabels && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 5,
            height: chartHeight,
            width: 80,
            zIndex: 2,
          }}
        >
          <Text
            style={{
              position: 'absolute',
              top: getY(median - threshold) - 17,
              right: 0,
              width: '100%',
              textAlign: 'right',
              fontSize: 12,
            }}
          >
            + Threshold
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: getY(median) - 8,
              right: 0,
              width: '100%',
              textAlign: 'right',
              fontSize: 12,
            }}
          >
            Median
          </Text>
          <Text
            style={{
              position: 'absolute',
              top: getY(median + threshold) + 2,
              right: 0,
              width: '100%',
              textAlign: 'right',
              fontSize: 12,
            }}
          >
            - Threshold
          </Text>
        </View>

      )}

      {/* Modal Dialog */}
      <ConsistencyChartModal isVisible={modalVisible} message={"Message"} onClose={() => setModalVisible(false)} />
    </View>
  );
}
