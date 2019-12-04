import { UserData } from '../types';

type PerformanceData = Required<
  Pick<UserData, 'gender' | 'restingHR' | 'maxHR' | 'lthr'>
>;

interface ActivityStream<T> {
  original_size: number;
  resolution: 'low' | 'medium' | 'high';
  series_type: 'distance' | 'time';
  data: T[];
}

interface ActivityStreams {
  time: ActivityStream<number>;
  heartrate: ActivityStream<number>;
  velocity_smooth: ActivityStream<number>;
}

const calculateHRSS = (
  {
    time: { data: times },
    heartrate: { data: heartrates },
    velocity_smooth: { data: velocities },
  }: ActivityStreams,
  { gender, restingHR, maxHR, lthr }: PerformanceData
) => {
  const movingThresholdKph = 0.1;
  const trimpGenderFactor = gender === 'male' ? 1.92 : 1.67;

  let trainingImpulse = 0;
  for (let i = 0; i < heartrates.length; i++) {
    if (i > 0 && velocities[i] * 3.6 > movingThresholdKph) {
      const durationSeconds = times[i] - times[i - 1];
      const durationMinutes = durationSeconds / 60;

      const hr = (heartrates[i] + heartrates[i - 1]) / 2;
      const heartRateReserve = (hr - restingHR) / (maxHR - restingHR);

      trainingImpulse +=
        durationMinutes *
        heartRateReserve *
        0.64 *
        Math.exp(trimpGenderFactor * heartRateReserve);
    }
  }

  const lactateThresholdReserve = (lthr - restingHR) / (maxHR - restingHR);
  const lactateThresholdTrainingImpulse =
    60 *
    lactateThresholdReserve *
    0.64 *
    Math.exp(trimpGenderFactor * lactateThresholdReserve);
  const hrss = (trainingImpulse / lactateThresholdTrainingImpulse) * 100;

  return hrss;
};

export { calculateHRSS };
