import { Component, signal } from '@angular/core';
import { CreditApplicationListWidget } from '../widgets/credit-application-list.widget';
import { CreditApplicationDetailWidget } from '../widgets/credit-application-detail.widget';

@Component({
  selector: 'panel-page',
  imports: [CreditApplicationListWidget, CreditApplicationDetailWidget],
  template: `
    <div class="max-w-6xl mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Panel de solicitudes</h1>
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
  private detailOpenSignal = signal(false);
  private selectedApplicationIdSignal = signal('');

  detailOpen = this.detailOpenSignal.asReadonly();
  selectedApplicationId = this.selectedApplicationIdSignal.asReadonly();

  protected onViewDetail(id: string): void {
    this.selectedApplicationIdSignal.set(id);
    this.detailOpenSignal.set(true);
  }

  protected onCloseDetail(): void {
    this.detailOpenSignal.set(false);
    this.selectedApplicationIdSignal.set('');
  }

  protected onStatusUpdated(): void {
    alert('Estado actualizado');
  }
}
