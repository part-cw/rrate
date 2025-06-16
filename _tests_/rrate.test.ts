import { getMedian, evaluateRecentTaps } from '@/utils/consistencyFunctions';

test('returns median of array', () => {
  expect(getMedian([1000, 1100, 1200])).toBe(1100);
});

const taps = "2020-04 - 29 12: 35: 42.6874; 1.7368; 3.4088; 5.1359; 7.0369";

test('checks if rrate of 20', () => {
  const result = evaluateRecentTaps({ taps: taps, tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(20);
});

// intervals median rate
