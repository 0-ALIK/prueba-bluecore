import { Component, output, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreditApplicationService } from '../../services/credit-application.service';
import { UiButtonComponent } from '../../../../shared/ui/components/button.component';

@Component({
  selector: 'credit-application-form',
  imports: [ReactiveFormsModule, UiButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6" novalidate>
      <div class="space-y-1">
        <label for="amount" class="block text-sm font-medium text-gray-700">
          Monto
        </label>

        <input
          id="amount"
          type="number"
          placeholder="5000"
          formControlName="amount"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        @if (amountError()) {
          <p class="text-sm text-red-600">
            {{ amountError() }}
          </p>
        }
      </div>

      <div class="space-y-1">
        <label for="term" class="block text-sm font-medium text-gray-700">
          Plazo (meses)
        </label>

        <input
          id="term"
          type="number"
          placeholder="60"
          formControlName="term"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        @if (termError()) {
          <p class="text-sm text-red-600">
            {{ termError() }}
          </p>
        }
      </div>

      <div class="space-y-1">
        <label for="cardId" class="block text-sm font-medium text-gray-700">
          Cedula
        </label>

        <input
          id="cardId"
          type="text"
          placeholder="8-994-181"
          formControlName="cardId"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        @if (cardIdError()) {
          <p class="text-sm text-red-600">
            {{ cardIdError() }}
          </p>
        }
      </div>

      @if (error()) {
        <div class="p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
          <p class="text-sm text-red-700">{{ error() }}</p>
        </div>
      }

      <div class="flex justify-end">
        <ui-button type="submit" [loading]="loading()">
          Crear solicitud
        </ui-button>
      </div>
    </form>
  `,
})
export class CreditApplicationFormWidget {
  private fb = inject(FormBuilder);
  private service = inject(CreditApplicationService);

  submitted = output<void>();

  loading = this.service.loading;
  error = this.service.error;

  form = this.fb.group({
    amount: [null as number | null, [Validators.required, Validators.min(500), Validators.max(50000)]],
    term: [null as number | null, [Validators.required, Validators.min(6), Validators.max(60)]],
    cardId: ['', [Validators.required, Validators.pattern(/^\d{1,3}-\d{3,4}-\d{3}$/)]],
  });

  amountError(): string | undefined {
    const control = this.form.get('amount');
    if (control?.touched && control.invalid) {
      if (control.hasError('required')) return 'El monto es requerido';
      if (control.hasError('min')) return 'El monto minimo es 500';
      if (control.hasError('max')) return 'El monto maximo es 50000';
    }
    return undefined;
  }

  termError(): string | undefined {
    const control = this.form.get('term');
    if (control?.touched && control.invalid) {
      if (control.hasError('required')) return 'El plazo es requerido';
      if (control.hasError('min')) return 'El plazo minimo es 6 meses';
      if (control.hasError('max')) return 'El plazo maximo es 60 meses';
    }
    return undefined;
  }

  cardIdError(): string | undefined {
    const control = this.form.get('cardId');
    if (control?.touched && control.invalid) {
      if (control.hasError('required')) return 'La cedula es requerida';
      if (control.hasError('pattern')) {
        return 'Formato invalido (ej: 8-994-181)';
      }
    }
    return undefined;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      alert('Por favor corrige los errores en el formulario');
      return;
    };

    const value = this.form.getRawValue();
    this.service.createCreditApplication({
      amount: value.amount!,
      term: value.term!,
      cardId: value.cardId!,
    }).subscribe({
      next: () => {
        this.form.reset();
        this.submitted.emit();
      },
    });
  }
}
