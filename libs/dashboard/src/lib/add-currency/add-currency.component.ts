import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { CurrencyPipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';

import { ConversionService } from '@cc/conversion-service';
import {
  CommaRegion,
  ConversionRates,
  CountryCode,
  CurrencyName,
  DotRegion,
} from '@cc/models';
import { getLocaleDecimalSeparator } from '@cc/utils';

import { AddCurrencyService } from './add-currency.service';

@Component({
  selector: 'lib-add-currency',
  standalone: true,
  imports: [CurrencyPipe, KeyValuePipe, NgTemplateOutlet],
  templateUrl: './add-currency.component.html',
  styleUrl: './add-currency.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCurrencyComponent {
  addCurrencyService = inject(AddCurrencyService);
  conversionService = inject(ConversionService);

  conversionRates = input.required<ConversionRates>();

  dialog = viewChild<ElementRef>('dialog');

  currencyName: Record<string, string> = CurrencyName;
  countryCode: Record<string, string> = CountryCode;
  localeId = getLocaleDecimalSeparator() === ',' ? CommaRegion : DotRegion;

  constructor() {
    effect(() => this.addCurrencyService.dialog.set(this.dialog()), {
      allowSignalWrites: true,
    });
  }
}
