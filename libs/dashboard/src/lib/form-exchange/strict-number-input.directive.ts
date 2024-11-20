import { Directive, HostListener } from '@angular/core';
import { getLocaleDecimalSeparator } from '@cc/utils';

@Directive({
  selector: '[strictNumberInput]',
  standalone: true,
})
export class StrictNumberInputDirective {
  private allowedKeys = [
    'Backspace',
    'Tab',
    'ArrowLeft',
    'ArrowRight',
    'Delete',
    'Home',
    'End',
  ];
  private decimalSeparator: string;
  private thousandSeparator: string;

  constructor() {
    this.decimalSeparator = getLocaleDecimalSeparator();
    this.thousandSeparator = this.decimalSeparator === '.' ? ',' : '.';
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (
      !this.isNumberKey(event) &&
      !this.allowedKeys.includes(event.key) &&
      !this.isCtrlCommandCombination(event) &&
      !(event.key === this.decimalSeparator && !this.hasDecimalSeparator(input))
    ) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('Text') || '';
    const input = event.target as HTMLInputElement;

    const normalizedInput = this.normalizePastedInput(pastedData);

    const validPattern = new RegExp(
      `^[0-9]*(${this.decimalSeparator}[0-9]*)?$`,
    );
    if (
      !validPattern.test(normalizedInput) ||
      normalizedInput.includes('e') ||
      normalizedInput.includes('E') ||
      (normalizedInput.includes(this.decimalSeparator) &&
        this.hasDecimalSeparator(input))
    ) {
      event.preventDefault();
    } else {
      input.value = normalizedInput;
      event.preventDefault();
    }
  }

  private isNumberKey(event: KeyboardEvent): boolean {
    return (
      (event.key >= '0' && event.key <= '9') ||
      (event.keyCode >= 96 && event.keyCode <= 105)
    );
  }

  private isCtrlCommandCombination(event: KeyboardEvent): boolean {
    return (
      (event.ctrlKey || event.metaKey) &&
      ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())
    );
  }

  private hasDecimalSeparator(input: HTMLInputElement): boolean {
    return input.value.includes(this.decimalSeparator);
  }

  private normalizePastedInput(input: string): string {
    return input
      .split(this.thousandSeparator)
      .join('')
      .replace(
        this.decimalSeparator === '.' ? ',' : '.',
        this.decimalSeparator,
      );
  }
}
