export function getMedian(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function getIntervals(taps: number[]): number[] {
  return taps.slice(1).map((t, i) => t - taps[i]);
}

export function getConsistencyFlags(intervals: number[], thresholdPercent: number): boolean[] {
  const median = getMedian(intervals);
  const threshold = (thresholdPercent / 100) * median;
  return intervals.map(interval => Math.abs(interval - median) <= threshold);
}
