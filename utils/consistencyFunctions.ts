// Testable functions related to the RRate algorithm (ie. those that don't use global variables or React hooks)

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
  const recent = timestamps.slice(-tapCountRequired);
  const intervals = recent.slice(1).map((t, i) => t - recent[i]);
  const median = getMedian(intervals);
  const threshold = (consistencyThreshold / 100) * median;

  const isConsistent = intervals.every(
    (interval) => Math.abs(interval - median) <= threshold
  );

  return {
    intervals,
    median,
    rate: Math.round(60 / median),
    isConsistent: isConsistent
  };
}

// Turns the timestamps array into a string formatted for REDCap that is consistent with data inputs from previous version of the app
export function generateRRTapString(timestamps: number[]): string {
  if (timestamps.length === 0) return '';

  const start = timestamps[0];

  const startDate = new Date(start * 1000); // Convert to milliseconds
  const addPaddingZero = (num: number) => num.toString().padStart(2, '0');

  const formattedStart = `${startDate.getFullYear()}-${addPaddingZero(startDate.getMonth() + 1)}-${addPaddingZero(startDate.getDate())}` +
    ` ${addPaddingZero(startDate.getHours())}:${addPaddingZero(startDate.getMinutes())}:${addPaddingZero(startDate.getSeconds())}.${startDate.getMilliseconds()}0`;

  const deltas = timestamps.slice(1).map(t => (t - start).toFixed(4));

  return [formattedStart, ...deltas].join(';');
}

// Returns local time in format of (Y-M-D H:M:S)
export function getLocalTimestamp() {
  const startDate = new Date();
  const formattedDate = `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()}` +
    ` ${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}`;

  return formattedDate;
}
