// Testable functions (ie. those that don't use global variables or React hooks)

// Returns the median of an array of numbers
export function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// Returns time intervals, median interval and rrate if the most recent taps are consistent (must have preset required number of taps to be consistent))
export function evaluateRecentTaps({ timestamps, tapCountRequired, consistencyThreshold }: { timestamps: number[], tapCountRequired: number, consistencyThreshold: number }) {
  if (timestamps.length < tapCountRequired) return null;

  const recent = timestamps.slice(-tapCountRequired);
  const intervals = recent.slice(1).map((t, i) => t - recent[i]);
  const median = getMedian(intervals);
  const threshold = (consistencyThreshold / 100) * median;

  const isConsistent = intervals.every(
    (interval) => Math.abs(interval - median) <= threshold
  );

  if (isConsistent) {
    return {
      intervals,
      median,
      rate: 60 / median,
    };
  }

  return null;
}

export function generateRRTapString(timestamps: number[]): string {
  if (timestamps.length === 0) return '';
  const start = timestamps[0];
  const deltas = timestamps.map(t => (t - start).toFixed(2));
  return [start.toFixed(2), ...deltas.slice(1)].join(';');
}