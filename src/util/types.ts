export type Time = `${number}:${number}`;

export function compareTimes(time1?: Time, time2?: Time): number {
  const [hours1, minutes1] = time1?.split(":").map(Number) || [0, 0];
  const [hours2, minutes2] = time2?.split(":").map(Number) || [0, 0];

  if (hours1 !== hours2) {
    return hours1 - hours2;
  }
  return minutes1 - minutes2;
}
