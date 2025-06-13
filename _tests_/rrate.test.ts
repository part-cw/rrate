import { getMedian, evaluateRecentTaps } from '@/utils/consistencyFunctions';

test('returns rrate based on median time interval in the last few consisent taps', () => {
  expect(getMedian([1000, 1100, 1200])).toBe(1100);
});