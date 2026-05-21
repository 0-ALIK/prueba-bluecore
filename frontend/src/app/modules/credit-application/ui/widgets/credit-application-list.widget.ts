import { Component, output, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { UiSelectComponent, SelectOption } from '../../../../shared/ui/components/select.component';
import { CreditApplicationService } from '../../services/credit-application.service';
import { CreditApplicationDto } from '../../api/dtos/credit-application.dto';
import { UiButtonComponent } from '../../../../shared/ui/components/button.component';

const statusOptions: SelectOption[] = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendiente' },
  { value: 'APPROVED', label: 'Aprobado' },
  { value: 'REJECTED', label: 'Rechazado' },
];

@Component({
  selector: 'credit-application-list',
  imports: [UiSelectComponent, CurrencyPipe, DatePipe, UiButtonComponent],
  template: `
    <div class="space-y-4">
      <div class="flex items-center gap-4">
        <div class="flex-1 max-w-xs">
          <ui-select
            label="Estado"
            [options]="statusOptions"
            (valueChange)="onStatusChange($event)"
          />
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (error()) {
        <div class="p-4 rounded-lg bg-red-50 border border-red-200" role="alert">
          <p class="text-sm text-red-700">{{ error() }}</p>
        </div>
      } @else if (applications().length === 0) {
        <div class="text-center py-12">
          <p class="text-gray-500">No se encontraron solicitudes</p>
        </div>
      } @else {
        <div class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th scope="col" class="text-left px-4 py-3 font-medium text-gray-600">Cedula</th>
                <th scope="col" class="text-left px-4 py-3 font-medium text-gray-600">Monto</th>
                <th scope="col" class="text-left px-4 py-3 font-medium text-gray-600">Plazo</th>
                <th scope="col" class="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th scope="col" class="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                <th scope="col" class="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (app of applications(); track app.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-gray-900">{{ app.cardId }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ app.amount | currency:'USD':'symbol':'1.0-0' }}</td>
                  <td class="px-4 py-3 text-gray-900">{{ app.term }} meses</td>
                  <td class="px-4 py-3">
                    <span [class]="statusBadgeClass(app.status)">
                      {{ statusLabel(app.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-gray-500">{{ app.createdAt | date:'short' }}</td>
                  <td class="px-4 py-3">
                    <ui-button variant="ghost" size="sm" (click)="viewDetail.emit(app.id)">
                      Ver detalle
                    </ui-button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between pt-2">
          <p class="text-sm text-gray-600">
            Mostrando {{ applications().length }} de {{ pagination().total }} solicitudes
          </p>
          <div class="flex gap-2">
            <ui-button
              [disabled]="pagination().page <= 1"
              (click)="onPageChange(pagination().page - 1)"
            >
              Anterior
            </ui-button>
            <ui-button
              [disabled]="pagination().page >= pagination().totalPages"
              (click)="onPageChange(pagination().page + 1)"
            >
              Siguiente
            </ui-button>
          </div>
        </div>
      }
    </div>
  `,
})
export class CreditApplicationListWidget implements OnInit, OnDestroy {
  private service = inject(CreditApplicationService);
  private destroy$ = new Subject<void>();

  viewDetail = output<string>();

  statusOptions = statusOptions;

  private currentStatus = signal<string>('');
  private currentPage = signal(1);
  private pageSize = 10;

  applications = signal<CreditApplicationDto[]>([]);
  pagination = signal({ total: 0, limit: 10, page: 1, totalPages: 1 });

  loading = this.service.loading;
  error = this.service.error;

  ngOnInit(): void {
    this.loadApplications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStatusChange(status: string): void {
    this.currentStatus.set(status);
    this.currentPage.set(1);
    this.loadApplications();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadApplications();
  }

  statusBadgeClass(status: string): string {
    const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
    switch (status) {
      case 'PENDING': return `${base} bg-yellow-100 text-yellow-800`;
      case 'APPROVED': return `${base} bg-green-100 text-green-800`;
      case 'REJECTED': return `${base} bg-red-100 text-red-800`;
      default: return `${base} bg-gray-100 text-gray-800`;
    }
  }

  statusLabel(status: string): string {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'APPROVED': return 'Aprobado';
      case 'REJECTED': return 'Rechazado';
      default: return status;
    }
  }

  private loadApplications(): void {
    const status = this.currentStatus() || undefined;
    this.service.getCreditApplications({
      status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | undefined,
      limit: this.pageSize,
      page: this.currentPage(),
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.applications.set(response.data);
        this.pagination.set(response.pagination);
      },
    });
  }
}
