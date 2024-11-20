import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { catchError, filter, Observable, of, switchMap, tap } from 'rxjs';

import { ENVIRONMENT } from '@cc/environments';
import { ConversionRates } from '@cc/models';
import { SharedReplayRefresh } from '@cc/utils';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ConversionService {
  private httpClient = inject(HttpClient);
  private environment = inject(ENVIRONMENT);
  private platformId = inject(PLATFORM_ID);

  amount = signal(100);

  private loadingRatesSignal = signal(false);
  loadingRates = this.loadingRatesSignal.asReadonly();

  private pinnedSignal = signal('USD');
  pinned = this.pinnedSignal.asReadonly();
  setPinnedCurrency(currencyCode: string): void {
    this.pinnedSignal.set(currencyCode);
    localStorage.setItem('user_pinned_currency', this.pinnedSignal());
  }

  private gameGroupGamesDataSource = new SharedReplayRefresh<ConversionRates>();
  private conversionRates$(
    baseCurrency: string,
  ): Observable<ConversionRates | null> {
    const cacheKey = `conversion-rates?base=${baseCurrency}`;
    return this.gameGroupGamesDataSource
      .sharedReplayTimerRefresh$(
        cacheKey,
        this.httpClient.get<ConversionRates>(
          `${this.environment.baseURL}/${cacheKey}`,
        ),
        1,
        120000,
      )
      .pipe(
        catchError(() => {
          this.loadingRatesSignal.set(false);
          return of(null);
        }),
      );
  }

  private baseCurrencySignal = signal('EUR');
  baseCurrency = this.baseCurrencySignal.asReadonly();
  conversionRates = toSignal<ConversionRates | null>(
    toObservable(this.baseCurrencySignal).pipe(
      filter(() => isPlatformBrowser(this.platformId)),
      tap(() => this.loadingRatesSignal.set(true)),
      switchMap((baseCurrency) => this.conversionRates$(baseCurrency)),
      tap(() => this.loadingRatesSignal.set(false)),
    ),
  );

  private favoritesSignal = signal<string[]>(['EUR', 'USD', 'GBP', 'RUB']);
  favorites = this.favoritesSignal.asReadonly();
  toggleFavorite(currencyCode: string) {
    this.favoritesSignal.update((val) => {
      if (val.includes(currencyCode)) {
        return val.filter((v) => v !== currencyCode);
      }
      return [currencyCode, ...val];
    });
    localStorage.setItem(
      'user_currency_list',
      JSON.stringify(this.favoritesSignal()),
    );
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.tryToRestoreCurrencyList();
      this.tryToRestoreBaseCurrency();
      this.tryToRestorePinnedCurrency();
    }
  }

  swapCurrencies() {
    const currentPin = this.pinned();
    this.setPinnedCurrency(this.baseCurrency());
    this.baseCurrencySignal.set(currentPin);
    localStorage.setItem('user_base_currency', this.baseCurrencySignal());
  }

  private tryToRestoreCurrencyList() {
    const userCurrencyList = localStorage.getItem('user_currency_list');
    if (userCurrencyList) {
      try {
        const parsedUserCurrencyList = JSON.parse(userCurrencyList) as string[];
        if (Array.isArray(parsedUserCurrencyList)) {
          this.favoritesSignal.set(parsedUserCurrencyList);
        }
      } catch (error) {}
    }
  }

  private tryToRestoreBaseCurrency() {
    const userBaseCurrency = localStorage.getItem('user_base_currency');
    if (userBaseCurrency) {
      this.baseCurrencySignal.set(userBaseCurrency);
    }
  }

  private tryToRestorePinnedCurrency() {
    const userPinnedCurrency = localStorage.getItem('user_pinned_currency');
    if (userPinnedCurrency) {
      this.pinnedSignal.set(userPinnedCurrency);
    }
  }
}
