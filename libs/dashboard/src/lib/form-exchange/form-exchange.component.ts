import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CountryCode, CurrencyName } from '@cc/models';
import { ConversionService } from '@cc/conversion-service';
import { getLocaleDecimalSeparator } from '@cc/utils';

import { AddCurrencyService } from '../add-currency/add-currency.service';
import { StrictNumberInputDirective } from './strict-number-input.directive';

@Component({
  selector: 'lib-form-exchange',
  standalone: true,
  imports: [FormsModule, StrictNumberInputDirective, NgTemplateOutlet],
  templateUrl: './form-exchange.component.html',
  styleUrl: './form-exchange.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormExchangeComponent {
  addCurrencyService = inject(AddCurrencyService);
  conversionService = inject(ConversionService);
  amount = model<number>(100);

  currencyCode = input.required<string>();

  currencyName: Record<string, string> = CurrencyName;
  countryCode: Record<string, string> = CountryCode;

  localeSeparator = getLocaleDecimalSeparator();

  constructor() {
    effect(
      () => {
        const amount = this.amount() || 0;
        this.conversionService.amount.set(
          parseFloat(
            this.localeSeparator === ','
              ? `${amount}`.replace(',', '.')
              : `${amount}`,
          ),
        );
      },
      { allowSignalWrites: true },
    );
  }

  showSwapDialog() {
    this.addCurrencyService.openDialog('swap');
  }
}

// todo LATER* migrate to V19
