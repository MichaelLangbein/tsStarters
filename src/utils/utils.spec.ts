import { add } from "./utils";

describe("utils test-suite", () => {
  it("adding should work", () => {
    expect(add(1, 2)).toEqual(3);
  });
});
