import { getMedian, evaluateRecentTaps } from '@/utils/consistencyFunctions';

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
  const result = evaluateRecentTaps({ taps: "2020-04-27 11:50:32.0644;2.8681;6.1887;9.226;11.9731", tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(20);
});

test('checks rrate of 32, 5 taps', () => {
  const result = evaluateRecentTaps({ taps: "2020-05-05 07:41:57.5379;1.9939;3.8189;5.472;7.4379", tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(32);
});

test('checks rrate of 68, 5 taps', () => {
  const result = evaluateRecentTaps({ taps: "2020-05-07 10:06:48.9557;.8188;1.7461;2.6635;3.5181", tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(68);
});

test('checks rrate of 41, 12 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768; 3.4793; 5.5242; 7.0071; 8.7398; 9.9591; 11.0923; 12.4352; 13.9168; 15.3355; 16.8109", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(41);
});

test('checks rrate of 43, 10 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-18 08:46:01.7025;1.2273;2.9672;4.2516;5.4113;6.5254;7.9705;9.4421;10.804;12.1176", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(43);
});


test('checks rrate of 20, 8 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-02 15:22:41.5854;2.0734;4.6304;8.0065;11.3491;14.0863;17.2783;20.0693", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(20);
});

test('checks rrate of 29, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-06 12:53:59.7902;2.2728;4.4066;6.4125;8.3062", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(29);
});

test('checks rrate of 23, 12 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-04 12:13:00.5449;3.6477;7.1669;9.9744;11.8709;12.3494;14.8977;18.5566;21.2419;23.851;26.4653;28.8773", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(23);
});

test('checks rrate of 32, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-05 07:41:57.5379;1.9939;3.8189;5.472;7.4379", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(32);
});

test('checks rrate of 29, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-05 11:11:36.8834;2.2213;4.3681;6.4291;8.4334", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(29);
});

test('checks rrate of 27, 6 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-08 08:28:14.0802;2.8903;5.3613;7.6073;9.7756;11.9289", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(27);
});

test('checks rrate of 41, 12 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-08 11:13:59.9186;1.5768;3.4793;5.5242;7.0071;8.7398;9.9591;11.0923;12.4352;13.9168;15.3355;16.8109", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(41);
});

test('checks rrate of 31, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-08 12:05:47.2266;2.0251;3.9752;5.7062;7.6791", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(31);
});


test('checks rrate of 48, 7 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-14 16:43:53.5358;1.6874;3.1437;4.4071;5.6588;6.7827;8.0458", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(48);
});


test('checks rrate of 44, 9 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-16 14:26:28.1769;2.3899;3.6302;4.7226;6.1786;7.4931;8.6914;10.197;11.6365", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(44);
});


test('checks rrate of 55, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-17 12:52:35.911;1.1689;2.3957;3.426;4.4375", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(55);
});

test('checks rrate of 26, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-18 11:00:22.4346;2.3898;4.7356;6.9285;9.0662", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(26);
});

// TEST: Inconsistent/null rrate checks
test('checks inconsistent rrate, 8 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768; 3.4793; 5.5242; 7.0071; 8.7398; 9.9591; 11.0923", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks insufficient taps, 0 taps', () => {
  const result = evaluateRecentTaps({
    taps: "", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 1 tap', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 2 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 3 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768; 3.4793", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 4 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768; 3.4793; 5.5242", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768; 3.4793; 5.5242; 7.0071", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 9 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-18 08:46:01.7025;1.2273;2.9672;4.2516;5.4113;6.5254;7.9705;9.4421;10.804", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});


test('checks inconsistent rrate, 6 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-02 15:22:41.5854;2.0734;4.6304;8.0065;11.3491;14.0863", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(null);
});

test('checks inconsistent rrate, 5 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-08 08:28:14.0802;2.8903;5.3613;7.6073;9.7756", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(27);
});

test('checks inconsistent rrate, 11 taps', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05-08 11:13:59.9186;1.5768;3.4793;5.5242;7.0071;8.7398;9.9591;11.0923;12.4352;13.9168;15.3355", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(41);
});

