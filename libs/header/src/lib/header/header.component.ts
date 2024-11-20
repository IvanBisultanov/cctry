import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'lib-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  darkMode = signal<boolean>(false); // todo LATER* check user preferences for initial value
}
