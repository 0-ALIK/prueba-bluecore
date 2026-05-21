import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [disabled]="loading() || disabled()"
      class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      @if (loading()) {
        <span>Cargando...</span>
      } @else {
        <ng-content />
      }
    </button>
  `,
})
export class UiButtonComponent {
  type = input<'button' | 'submit'>('button');
  loading = input(false);
  disabled = input(false);
}
