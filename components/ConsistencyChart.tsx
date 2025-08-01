import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Line } from 'react-native-svg';
import { useGlobalVariables } from '../utils/globalContext';
import ConsistencyChartModal from '../components/ConsistencyChartModal';
import { getMedian } from '../utils/consistencyFunctions';
import { GlobalStyles as Style } from '../assets/styles';
import useTranslation from '../utils/useTranslation';
import { Theme } from '../assets/theme';

// Show info button on results page and labels on modal dialog
type ConsistencyChartProps = {
  showInfoButton?: boolean;
  showLabels?: boolean;
  age?: string
};

// Visualizes the consistency of tap intervals by graphing taps against the median tap interval.
export default function ConsistencyChart({ showInfoButton, showLabels, age }: ConsistencyChartProps) {
  const { consistencyThreshold, tapTimestamps, tapCountRequired, rrate } = useGlobalVariables();
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();

  const chartWidth = 350;
  const chartHeight = 80;
  const chartPadding = 12;

  const tapLimit = tapCountRequired;
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
  const pointSpacing = chartWidth / Math.max(1, tapTimestamps.length) - 7; // leaves padding on the right (arbitrarily set to 3px)

  const points = tapTimestamps.map((_, i) => {
    const x = i * pointSpacing + (i === 0 ? chartPadding : 0); // adds padding to the left of the first point

    let y: number;
    let isConsistent: boolean;

    if (i === 0) {
      y = getY(median); // first point always lies on the median line and is consistent
      isConsistent = true;
    } else {
      const interval = tapTimestamps[i] - tapTimestamps[i - 1];
      y = getY(interval);
      isConsistent = Math.abs(interval - median) <= threshold;

    }
    return { x, y, isConsistent };
  });


  return (
    <View style={{ backgroundColor: '#fff', borderRadius: 10 }}>
      <View style={{ backgroundColor: "fff", height: chartHeight, borderRadius: 10 }}>
        {/* Background Threshold Band */}
        <View
          style={[Style.backgroundThresholdBand, { top: grayTop, height: grayHeight, }]} />

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
        {(showInfoButton && Number(rrate) > 0) && (
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              position: 'absolute',
              right: 0,
              top: 13,
              backgroundColor: 'white',
              borderRadius: 30,
              padding: 5,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowRadius: 3,
              zIndex: 2,
            }}
          >
            <MaterialCommunityIcons name="information-outline" size={42} color="black" />
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
                fontWeight: 'bold',
                color: Theme.colors.tertiary
              }}
            >
              {t("FAST")}
            </Text>
            <Text
              style={{
                position: 'absolute',
                top: getY(median) - 8,
                right: 0,
                width: '100%',
                textAlign: 'right',
                fontSize: 12,
                fontWeight: 'bold',
                color: Theme.colors.secondary
              }}
            >
              {t("CONSISTENT")}
            </Text>
            <Text
              style={{
                position: 'absolute',
                top: getY(median + threshold) + 2,
                right: 0,
                width: '100%',
                textAlign: 'right',
                fontSize: 12,
                fontWeight: 'bold',
                color: Theme.colors.tertiary
              }}
            >
              {t("SLOW")}
            </Text>
          </View>

        )}

        {/* Modal Dialog; only available when on Results Screen */}
        <ConsistencyChartModal isVisible={modalVisible} age={age} onClose={() => setModalVisible(false)} />
      </View>
    </View>
  );
}
