import { Component, input, output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'ui-select',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => UiSelectComponent), multi: true }],
  template: `
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label() }}
    </label>
    <select
      [class]="selectClass"
      [value]="value"
      (change)="onSelectChange($any($event).target.value)"
      (blur)="onTouched()"
    >
      @if (placeholder()) {
        <option value="" disabled>{{ placeholder() }}</option>
      }
      @for (option of options(); track option.value) {
        <option [value]="option.value">{{ option.label }}</option>
      }
    </select>
  `,
})
export class UiSelectComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);

  valueChange = output<string>();

  protected value: string = '';
  protected onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected selectClass = 'block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-1 focus:border-blue-500 focus:ring-blue-500';

  protected onSelectChange(value: string): void {
    this.value = value;
    this.onChange(value);
    this.valueChange.emit(value);
  }

  writeValue(value: string): void { this.value = value ?? ''; }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
