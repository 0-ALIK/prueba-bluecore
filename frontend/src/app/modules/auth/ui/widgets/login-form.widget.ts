import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UiButtonComponent } from '../../../../shared/ui/components/button.component';

@Component({
  selector: 'login-form',
  imports: [ReactiveFormsModule, UiButtonComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6" novalidate>
      <div class="space-y-1">
        <label for="email" class="block text-sm font-medium text-gray-700">
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="flavio@flavio.com"
          formControlName="email"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        @if (emailError()) {
          <p class="text-sm text-red-600">
            {{ emailError() }}
          </p>
        }
      </div>

      <div class="space-y-1">
        <label for="password" class="block text-sm font-medium text-gray-700">
          Contraseña
        </label>

        <input
          id="password"
          type="password"
          placeholder="password123"
          formControlName="password"
          class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        @if (passwordError()) {
          <p class="text-sm text-red-600">
            {{ passwordError() }}
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
          Iniciar sesión
        </ui-button>
      </div>
    </form>
  `,
})
export class LoginFormWidget {
  private fb = inject(FormBuilder);
  private service = inject(AuthService);

  loading = this.service.loading;
  error = this.service.error;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  emailError(): string | undefined {
    const control = this.form.get('email');
    if (control?.touched && control.invalid) {
      if (control.hasError('required')) return 'El email es requerido';
      if (control.hasError('email')) return 'Formato de email invalido';
    }
    return undefined;
  }

  passwordError(): string | undefined {
    const control = this.form.get('password');
    if (control?.touched && control.invalid) {
      if (control.hasError('required')) return 'La contraseña es requerida';
      if (control.hasError('minLength')) return 'La contraseña debe tener al menos 6 caracteres';
    }
    return undefined;
  }

  onSubmit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const value = this.form.getRawValue();
    this.service.login({
      email: value.email!,
      password: value.password!,
    }).subscribe();
  }
}
