import { getMedian, evaluateRecentTaps } from '@/utils/consistencyFunctions';

// test('returns median of array', () => {
//   expect(getMedian([1000, 1100, 1200])).toBe(1100);
// });

// // TEST: Evaluate recent taps function, which returns the time intervals, median time interval and rrate based on tap data

// test('checks low rrate (20)', () => {
//   const result = evaluateRecentTaps({ taps: "2020-04-27 11:50:32.0644;2.8681;6.1887;9.226;11.9731", tapCountRequired: 5, consistencyThreshold: 13 });
//   expect(result && result.rate).toBe(20);
// });

// test('checks medium rrate (32)', () => {
//   const result = evaluateRecentTaps({ taps: "2020-05-05 07:41:57.5379;1.9939;3.8189;5.472;7.4379", tapCountRequired: 5, consistencyThreshold: 13 });
//   expect(result && result.rate).toBe(32);
// });

test('checks high rrate of 68', () => {
  const result = evaluateRecentTaps({ taps: "2020-05-07 10:06:48.9557;.8188;1.7461;2.6635;3.5181", tapCountRequired: 5, consistencyThreshold: 13 });
  expect(result && result.rate).toBe(68);
});

test('checks rrate of 41', () => {
  const result = evaluateRecentTaps({
    taps: "2020-05 -08 11: 13: 59.9186; 1.5768; 3.4793; 5.5242; 7.0071; 8.7398; 9.9591; 11.0923; 12.4352; 13.9168; 15.3355; 16.8109", tapCountRequired: 5, consistencyThreshold: 13
  });
  expect(result && result.rate).toBe(41);
});

// test('checks rrate of 43', () => {
//   const result = evaluateRecentTaps({
//     taps: "2020-05-18 08:46:01.7025;1.2273;2.9672;4.2516;5.4113;6.5254;7.9705;9.4421;10.804;12.1176", tapCountRequired: 5, consistencyThreshold: 13
//   });
//   expect(result && result.rate).toBe(43);
// });


// test('checks rrate of 20', () => {
//   const result = evaluateRecentTaps({
//     taps: "2020-05-02 15:22:41.5854;2.0734;4.6304;8.0065;11.3491;14.0863;17.2783;20.0693", tapCountRequired: 5, consistencyThreshold: 13
//   });
//   expect(result && result.rate).toBe(20);
// });