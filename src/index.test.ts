import { interval, Observable, of } from "rxjs";
import { concat, find, repeat, takeUntil } from "rxjs/operators";

import { rateLimit } from ".";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LIMIT = 3;
const INTERVAL = 1000;
const TRIGGER = {};

describe("rateLimit operator", () => {
  it("is a function", () => {
    expect(rateLimit).toBeInstanceOf(Function);
  });

  it("returns a function", () => {
    expect(rateLimit(LIMIT, INTERVAL)).toBeInstanceOf(Function);
  });
});

describe("function returned by rateLimit()", () => {
  it("returns an Observable when given an Observable", () => {
    expect(rateLimit(LIMIT, INTERVAL)(interval(100))).toBeInstanceOf(
      Observable,
    );
  });
});

describe("Observable piped through rateLimit", () => {
  describe("when fewer than `limit` items were emitted within `windowMsec`", () => {
    it("emits a new item synchronously", () => {
      const tick = jest.fn();

      of(TRIGGER)
        .pipe(rateLimit(LIMIT, INTERVAL))
        .subscribe(tick);

      expect(tick.mock.calls.length).toEqual(1);
      expect(tick.mock.calls[0][0]).toEqual(TRIGGER);
    });
  });

  describe("when exactly `limit` items have been emitted within `windowMsec`", () => {
    it("emits a new item after `windowMsec` no longer contains `limit` items", async done => {
      const promise = of({})
        .pipe(
          repeat(10),
          concat(of(TRIGGER)),
          rateLimit(LIMIT, INTERVAL),
          find(item => item === TRIGGER),
        )
        .toPromise();

      const before = Date.now();
      await promise;
      const after = Date.now();
      expect(after - before).toBeGreaterThanOrEqual(INTERVAL);
      done();
    });
  });

  it("emits no more than `limit` times inside of `windowMsec`", async done => {
    const tick = jest.fn();
    // Try to emit twice as fast as the rate limit allows
    const subscription = interval(INTERVAL / LIMIT / 2)
      .pipe(rateLimit(LIMIT, INTERVAL))
      .subscribe(tick);

    await sleep(INTERVAL);
    expect(tick.mock.calls.length).toBeLessThanOrEqual(LIMIT);
    subscription.unsubscribe();
    done();
  });
});
