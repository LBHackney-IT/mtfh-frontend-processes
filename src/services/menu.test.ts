import { mockPersonV1 } from "@hackney/mtfh-test-utils";

import { showChangeOfName } from "./menu";

export const createMockPersonWithTenure = (isActive: boolean, type: string) => ({
  ...mockPersonV1,
  tenures: [
    {
      ...mockPersonV1.tenures[0],
      isActive,
      type,
    },
  ],
});

describe("#showChangeOfName", () => {
  test("returns true if person has only 1 tenure and it is Active & Secure", () => {
    const person = createMockPersonWithTenure(true, "Secure");
    const result = showChangeOfName({ person });
    expect(result).toBe(true);
  });
  test("returns false if person has only multiple Active & Secure tenures", () => {
    const person = createMockPersonWithTenure(true, "Secure");
    person.tenures.push(person.tenures[0]);
    const result = showChangeOfName({ person });
    expect(result).toBe(false);
  });
  test("returns false if person has only 1 tenure and it is Active but its type is not Secure", () => {
    const person = createMockPersonWithTenure(true, "Securee");
    const result = showChangeOfName({ person });
    expect(result).toBe(false);
  });
});
