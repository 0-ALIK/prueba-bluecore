import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreditApplicationFormWidget } from '../widgets/credit-application-form.widget';
import { SharedAuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'create-application-page',
  imports: [CreditApplicationFormWidget, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Crear solicitud de credito</h1>
        <nav class="flex items-center gap-4">
          <a routerLink="/panel" class="text-sm font-medium text-blue-600 hover:text-blue-700">
            Panel
          </a>
          @if (authService.isAuthenticated()) {
            <button
              type="button"
              (click)="authService.logout()"
              class="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Cerrar sesión
            </button>
          } @else {
            <a routerLink="/login" class="text-sm font-medium text-blue-600 hover:text-blue-700">
              Iniciar sesión
            </a>
          }
        </nav>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <credit-application-form (submitted)="onSubmitted()" />
      </div>
    </div>
  `,
})
export class CreateApplicationPage {
  authService = inject(SharedAuthService);

  onSubmitted(): void {
    alert('Solicitud creada exitosamente');
  }
}
