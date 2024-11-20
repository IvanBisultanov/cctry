import { ClipboardModule } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ConversionService } from '@cc/conversion-service';
import {
  CommaRegion,
  ConversionRates,
  CountryCode,
  CurrencyName,
  DotRegion,
} from '@cc/models';
import { getLocaleDecimalSeparator } from '@cc/utils';

@Component({
  selector: 'lib-currency-list',
  standalone: true,
  imports: [ClipboardModule, CurrencyPipe],
  templateUrl: './currency-list.component.html',
  styleUrl: './currency-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyListComponent {
  conversionService = inject(ConversionService);

  conversionRates = input.required<ConversionRates>();

  currentDeltaX = signal(0);
  currentPanItem = signal('');
  hide = signal(false);
  copiedCurrencyCode = signal<string | null>(null);
  currencyName: Record<string, string> = CurrencyName;
  countryCode: Record<string, string> = CountryCode;
  localeId = getLocaleDecimalSeparator() === ',' ? CommaRegion : DotRegion;

  private startX: number = 0;
  private deltaX: number = 0;
  private isSwiping: boolean = false;

  onSwipeStart(event: TouchEvent | MouseEvent): void {
    this.startX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.isSwiping = true;
  }

  onSwipeMove(event: TouchEvent | MouseEvent, currencyCode: string): void {
    if (!this.isSwiping) return;

    const currentX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    this.deltaX = currentX - this.startX;
    this.currentPanItem.set(currencyCode);
    if (-100 > this.deltaX) {
      this.currentDeltaX.set(-100);
    } else if (100 < this.deltaX) {
      this.currentDeltaX.set(100);
    } else {
      this.currentDeltaX.set(this.deltaX);
    }
  }

  onSwipeEnd(currencyCode: string): void {
    if (this.isSwiping) {
      // Minimum threshold for swipe
      if (Math.abs(this.deltaX) > 100) {
        if (this.deltaX > 0) {
          this.currentDeltaX.set(0);
          this.conversionService.setPinnedCurrency(currencyCode);
          this.hide.set(false);
        } else {
          this.currentDeltaX.set(-1000);
          this.hide.set(true);
          setTimeout(() => {
            this.conversionService.toggleFavorite(currencyCode);
            this.hide.set(false);
            this.conversionService.setPinnedCurrency(
              this.conversionService
                .favorites()
                .find((i) => i !== this.conversionService.baseCurrency())!,
            );
          }, 300);
        }
      } else {
        this.currentDeltaX.set(0);
        this.hide.set(false);
      }
      this.startX = 0;
      this.deltaX = 0;
      this.isSwiping = false;
    }
  }

  onCopySuccess(currencyCode: string): void {
    this.copiedCurrencyCode.set(currencyCode);
    setTimeout(() => this.copiedCurrencyCode.set(null), 350);
  }
}
