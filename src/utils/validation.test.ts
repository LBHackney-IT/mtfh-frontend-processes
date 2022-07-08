import { areAllTruthy } from "./validation";

describe("validation.ts", () => {
  describe("#areAllTruthy", () => {
    test("returns true if all values are truthy", () => {
      expect(areAllTruthy("one", 1, true)).toBeTruthy();
    });
    test("returns true if at least 1 value is not truthy", () => {
      expect(areAllTruthy("one", 1, undefined)).toBeFalsy();
      expect(areAllTruthy("", 1, true)).toBeFalsy();
      expect(areAllTruthy("one", 0, true)).toBeFalsy();
    });
  });
});
