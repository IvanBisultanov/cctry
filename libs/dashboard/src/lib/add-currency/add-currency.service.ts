import { ElementRef, Injectable, signal } from '@angular/core';

export type AddCurrencyDialogMode = 'add' | 'swap';

@Injectable({ providedIn: 'root' })
export class AddCurrencyService {
  dialog = signal<ElementRef | undefined>(undefined);
  isOpen = signal<boolean>(false);
  mode = signal<AddCurrencyDialogMode>('add');

  openDialog(mode?: AddCurrencyDialogMode) {
    const dialog = this.dialog()?.nativeElement;
    if (dialog) {
      if (mode) {
        this.mode.set(mode);
      }
      this.dialog()?.nativeElement.showModal();
      this.dialog()?.nativeElement.addEventListener(
        'close',
        () => {
          this.mode.set('add');
          this.isOpen.set(false);
        },
        { once: true },
      );
      this.isOpen.set(true);
    }
  }
}
