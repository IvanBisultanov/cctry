import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ConversionService } from '@cc/conversion-service';

import { CurrencyListComponent } from '../currency-list/currency-list.component';
import { FormExchangeComponent } from '../form-exchange/form-exchange.component';
import { AddCurrencyComponent } from '../add-currency/add-currency.component';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CurrencyListComponent, FormExchangeComponent, AddCurrencyComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  conversionService = inject(ConversionService);
}
