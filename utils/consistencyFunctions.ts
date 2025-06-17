// Testable functions (ie. those that don't use global variables or React hooks)

// Returns the median of an array of numbers
export function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Returns time intervals, median interval and rrate if the most recent taps are consistent (must have preset required number of taps to be consistent)
export function evaluateRecentTaps({
  taps,
  tapCountRequired,
  consistencyThreshold,
}: {
  taps: string;
  tapCountRequired: number;
  consistencyThreshold: number;
}) {
  if (!taps) return null;
  console.log('Evaluating taps:', taps);

  const parts = taps.split(';');
  if (parts.length < tapCountRequired) return null;

  const elapsedTimes = parts.slice(1).map(Number);
  const recent = elapsedTimes.slice(-tapCountRequired);

  const intervals = [];
  for (let i = 1; i < recent.length; i++) {
    intervals.push(recent[i] - recent[i - 1]);
  }
  console.log('Intervals:', intervals);

  const median = getMedian(intervals);
  console.log('Median interval:', median);
  const threshold = (consistencyThreshold / 100) * median;

  const isConsistent = intervals.every(
    (interval) => Math.abs(interval - median) <= threshold
  );

  if (isConsistent) {
    return {
      intervals,
      median,
      rate: Math.round(60 / median),
      // rate: 60 / median,
    };
  }

  return null;
}

export function generateRRTapString(timestamps: number[]): string {
  if (timestamps.length === 0) return '';

  const start = timestamps[0];

  const startDate = new Date(start * 1000); // convert seconds → milliseconds

  const formattedStart = startDate.toISOString()
    .replace('T', ' ')
    .replace('Z', '')
    .slice(0, 23); // e.g. "2020-04-27 11:50:32.064" (ISO without trailing Z)

  const deltas = timestamps.slice(1).map(t => (t - start).toFixed(4));

  return [formattedStart, ...deltas].join(';');
}
