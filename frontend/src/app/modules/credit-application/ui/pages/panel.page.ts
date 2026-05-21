import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CreditApplicationListWidget } from '../widgets/credit-application-list.widget';
import { CreditApplicationDetailWidget } from '../widgets/credit-application-detail.widget';
import { SharedAuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'panel-page',
  imports: [CreditApplicationListWidget, CreditApplicationDetailWidget, RouterLink],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Panel de solicitudes</h1>
        <nav class="flex items-center gap-4">
          <a routerLink="/" class="text-sm font-medium text-blue-600 hover:text-blue-700">
            Crear solicitud
          </a>
          <button
            type="button"
            (click)="authService.logout()"
            class="text-sm font-medium text-red-600 hover:text-red-700"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <credit-application-list (viewDetail)="onViewDetail($event)" />
      </div>
    </div>

    <credit-application-detail
      [open]="detailOpen()"
      [applicationId]="selectedApplicationId()"
      (close)="onCloseDetail()"
      (statusUpdated)="onStatusUpdated()"
    />
  `,
})
export class PanelPage {
  authService = inject(SharedAuthService);

  private detailOpenSignal = signal(false);
  private selectedApplicationIdSignal = signal('');

  detailOpen = this.detailOpenSignal.asReadonly();
  selectedApplicationId = this.selectedApplicationIdSignal.asReadonly();

  onViewDetail(id: string): void {
    this.selectedApplicationIdSignal.set(id);
    this.detailOpenSignal.set(true);
  }

  onCloseDetail(): void {
    this.detailOpenSignal.set(false);
    this.selectedApplicationIdSignal.set('');
  }

  onStatusUpdated(): void {
    alert('Estado actualizado');
  }
}
