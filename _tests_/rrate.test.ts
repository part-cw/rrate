import { getMedian, evaluateRecentTaps, generateRRTapString } from '@/utils/consistencyFunctions';

// TEST: Get median function, used in evaluateRecentTaps function
test('returns median of similar-valued array', () => {
  expect(getMedian([1000, 1100, 1200])).toBe(1100);
});


test('returns median of single item array', () => {
  expect(getMedian([5])).toBe(5);
});


test('returns median of even-numbered array', () => {
  expect(getMedian([5, 10000, 478, 20])).toBe(249);
});


// TEST: Evaluate recent taps function, which returns the time intervals, median time interval and rrate based on tap data

test('checks rrate of 20, 5 taps), ', () => {
  const result = evaluateRecentTaps({ timestamps: [1587988232.0644, 1587988234.9325, 1587988238.2531, 1587988241.2904, 1587988244.0375], tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(20);
});

test('checks rrate of 32, 5 taps', () => {
  const result = evaluateRecentTaps({ timestamps: [1588664517.5379, 1588664519.5318, 1588664521.3568, 1588664523.0098999, 1588664524.9758], tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(32);
});

test('checks rrate of 68, 5 taps', () => {
  const result = evaluateRecentTaps({ timestamps: [1588846008.9557, 1588846009.7745, 1588846010.7017999, 1588846011.6192, 1588846012.4738], tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(68);
});

test('checks rrate of 41, 12 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588936439.9186, 1588936441.4954002, 1588936443.3979, 1588936445.4428, 1588936446.9257002, 1588936448.6584, 1588936449.8777, 1588936451.0109, 1588936452.3538, 1588936453.8354, 1588936455.2541, 1588936456.7295], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(41);
});

test('checks rrate of 43, 10 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1589791561.7025, 1589791562.9298, 1589791564.6697001, 1589791565.9541001, 1589791567.1138, 1589791568.2279, 1589791569.673, 1589791571.1446002, 1589791572.5065, 1589791573.8201], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(43);
});


test('checks rrate of 20, 8 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588432961.5854, 1588432963.6588001, 1588432966.2158, 1588432969.5919, 1588432972.9345002, 1588432975.6717, 1588432978.8637002, 1588432981.6547], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(20);
});

test('checks rrate of 29, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588769639.7902, 1588769642.063, 1588769644.1968, 1588769646.2027, 1588769648.0964], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(29);
});

test('checks rrate of 23, 12 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588594380.5449, 1588594384.1926, 1588594387.7117999, 1588594390.5193, 1588594392.4157999, 1588594392.8943, 1588594395.4426, 1588594399.1015, 1588594401.7868, 1588594404.3959, 1588594407.0102, 1588594409.4222], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(23);
});

test('checks rrate of 32, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588664517.5379, 1588664519.5318, 1588664521.3568, 1588664523.0098999, 1588664524.9758], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(32);
});

test('checks rrate of 29, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588677096.8834, 1588677099.1046999, 1588677101.2515, 1588677103.3125, 1588677105.3167999], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(29);
});

test('checks rrate of 27, 6 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588926494.0802, 1588926496.9705, 1588926499.4415, 1588926501.6875, 1588926503.8558, 1588926506.0091], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(27);
});

test('checks rrate of 41, 12 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588936439.9186, 1588936441.4954002, 1588936443.3979, 1588936445.4428, 1588936446.9257002, 1588936448.6584, 1588936449.8777, 1588936451.0109, 1588936452.3538, 1588936453.8354, 1588936455.2541, 1588936456.7295], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(41);
});

test('checks rrate of 31, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588939547.2266, 1588939549.2517, 1588939551.2017999, 1588939552.9327998, 1588939554.9057], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(31);
});


test('checks rrate of 48, 7 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1589474633.5358, 1589474635.2232, 1589474636.6794999, 1589474637.9429, 1589474639.1945999, 1589474640.3185, 1589474641.5816], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(48);
});


test('checks rrate of 44, 9 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1589639188.1769, 1589639190.5667999, 1589639191.8070998, 1589639192.8995, 1589639194.3555, 1589639195.6699998, 1589639196.8683, 1589639198.3739, 1589639199.8133998], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(44);
});


test('checks rrate of 55, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1589719955.911, 1589719957.0799, 1589719958.3067, 1589719959.3370001, 1589719960.3485], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(55);
});

test('checks rrate of 26, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1589799622.4346, 1589799624.8244002, 1589799627.1702, 1589799629.3631, 1589799631.5008001], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(26);
});

// TEST: Inconsistent/null rrate checks
test('checks inconsistent rrate, 8 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588936439.9186, 1588936441.4954002, 1588936443.3979, 1588936445.4428, 1588936446.9257002, 1588936448.6584, 1588936449.8777, 1588936451.0109], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});

test('checks inconsistent rrate, 4 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588936439.9186, 1588936441.4954002, 1588936443.3979, 1588936445.4428], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});

test('checks inconsistent rrate, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588936439.9186, 1588936441.4954002, 1588936443.3979, 1588936445.4428, 1588936446.9257002], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});

test('checks inconsistent rrate, 9 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1589791561.7025, 1589791562.9298, 1589791564.6697001, 1589791565.9541001, 1589791567.1138, 1589791568.2279, 1589791569.673, 1589791571.1446002, 1589791572.5065], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});


test('checks inconsistent rrate, 6 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588432961.5854, 1588432963.6588001, 1588432966.2158, 1588432969.5919, 1588432972.9345002, 1588432975.6717], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});

test('checks inconsistent rrate, 5 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588926494.0802, 1588926496.9705, 1588926499.4415, 1588926501.6875, 1588926503.8558], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});

test('checks inconsistent rrate, 11 taps', () => {
  const result = evaluateRecentTaps({
    timestamps: [1588936439.9186, 1588936441.4954002, 1588936443.3979, 1588936445.4428, 1588936446.9257002, 1588936448.6584, 1588936449.8777, 1588936451.0109, 1588936452.3538, 1588936453.8354, 1588936455.2541], tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.isConsistent).toBe(false);
});

// TEST: generate rr_tap string (e.g 2020-05-08 11:13:59.9186;1.5768;3.4793) from array of timestamps
test('checks if rrtaap string is generated correctly for empty string', () => {
  const result = generateRRTapString([]);
  expect(result).toBe("");
});

test('checks if rrtaap string is generated correctly for non-empty string in local timezone', () => {
  const result = generateRRTapString([1750181825.141, 1750181826.948, 1750181827.498, 1750181828.066, 1750181828.629, 1750181829.263, 1750181829.913]);
  expect(result).toBe("2025-06-17 10:37:05.1410;1.8070;2.3570;2.9250;3.4880;4.1220;4.7720");
});

test('checks single millisecond timestamp in local timezone', () => {
  const result = generateRRTapString([1751310781.943]);
  expect(result).toBe("2025-06-30 12:13:01.9430");
});


