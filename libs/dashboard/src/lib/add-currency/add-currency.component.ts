import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { CurrencyPipe, KeyValuePipe, NgTemplateOutlet } from '@angular/common';
import {
  CommaRegion,
  ConversionRates,
  CountryCode,
  CurrencyName,
  DotRegion,
} from '@cc/models';
import { ConversionService } from '@cc/conversion-service';
import { getLocaleDecimalSeparator } from '@cc/utils';

@Component({
  selector: 'lib-add-currency',
  standalone: true,
  imports: [CurrencyPipe, KeyValuePipe, NgTemplateOutlet],
  templateUrl: './add-currency.component.html',
  styleUrl: './add-currency.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCurrencyComponent {
  conversionService = inject(ConversionService);

  conversionRates = input.required<ConversionRates>();

  currencyName: Record<string, string> = CurrencyName;
  countryCode: Record<string, string> = CountryCode;
  localeId = getLocaleDecimalSeparator() === ',' ? CommaRegion : DotRegion;
}
