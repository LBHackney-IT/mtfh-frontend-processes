export const areAllTruthy = (...values: any[]): boolean => {
  return values.every((value) => Boolean(value));
};
