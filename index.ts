import { Observable } from "rxjs";

function rateLimit(limit: number, windowMsec: number) {
  return <T>(x: Observable<T>) => {
    return x;
  };
}

export { rateLimit };
