import { Observable, SchedulerLike, shareReplay } from 'rxjs';

export class SharedReplayRefresh<T> {
  private sharedReplay: Record<string, Observable<T>> = {};
  private subscriptionTime: Record<string, number> = {};

  sharedReplayTimerRefresh$(
    key: string,
    source$: Observable<T>,
    bufferSize: number = 1,
    windowTime: number = 10e12,
    scheduler?: SchedulerLike,
  ): Observable<T> {
    const currentTime = Date.now();
    if (!this.sharedReplay[key] || currentTime - this.subscriptionTime[key] > windowTime) {
      this.sharedReplay[key] = source$.pipe(shareReplay(bufferSize, windowTime, scheduler));
      this.subscriptionTime[key] = currentTime;
    }
    return this.sharedReplay[key];
  }
}
