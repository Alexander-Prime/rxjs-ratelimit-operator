import { concat, Observable, of, zip } from "rxjs";
import { delay, map, repeat } from "rxjs/operators";

/**
 * Emits up to `limit` items from the source Observable within a rolling window
 * of `windowMsec`. If the source observable emits items faster than the rate
 * limit allows, they are delayed until the time window no longer contains
 * `limit` previously emitted items.
 *
 * @param limit The maximum number of items to emit within the given time window
 * @param window The duration of time to emit no more than `limit` items within
 */
function rateLimit(limit: number, window: number) {
  return <T>(source: Observable<T>) => {
    // Start with the first `limit` number of items already emittable
    const initialRelease = of({}).pipe(repeat(limit));

    // Release another item `windowMsec` miliseconds after one has been comsumed
    const delayedRelease = source.pipe(delay(window));

    const release = concat(initialRelease, delayedRelease);

    return zip(source, release).pipe(map(([a]) => a));
  };
}

export { rateLimit };
