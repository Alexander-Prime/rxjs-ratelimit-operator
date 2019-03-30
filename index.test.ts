import { interval, Observable } from "rxjs";

import { rateLimit } from ".";

describe("rateLimit operator", () => {
  it("is a function", () => {
    expect(rateLimit).toBeInstanceOf(Function);
  });

  it("returns a function", () => {
    expect(rateLimit(0, 0)).toBeInstanceOf(Function);
  });

  describe("function returned by rateLimit()", () => {
    it("returns an Observable when given an Observable", () => {
      expect(rateLimit(0, 0)(interval(100))).toBeInstanceOf(Observable);
    });
  });
});
