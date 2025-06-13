import { getMedian, evaluateRecentTaps } from '@/utils/consistencyFunctions';

test('returns median of array', () => {
  expect(getMedian([1000, 1100, 1200])).toBe(1100);
});

const timestamps = [1718300000000, 1718300001200, 1718300002400,];

test('checks if rrate is correct for perfectly consistent taps', () => {
  expect(evaluateRecentTaps({ timestamps, tapCountRequired: 5, consistencyThreshold: 13 })).toBe(1100);
});



// intervals median rate
