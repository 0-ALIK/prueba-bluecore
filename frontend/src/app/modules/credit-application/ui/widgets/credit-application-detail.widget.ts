import { Component, input, output, signal, inject, computed, OnChanges } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiModalComponent } from '../../../../shared/ui/components/modal.component';
import { CreditApplicationService } from '../../services/credit-application.service';
import { CreditApplicationDetailResponse } from '../../api/services/credit-application.api.service';
import { UiButtonComponent } from '../../../../shared/ui/components/button.component';

@Component({
  selector: 'credit-application-detail',
  imports: [UiModalComponent, ReactiveFormsModule, CurrencyPipe, DatePipe, UiButtonComponent],
  template: `
    <ui-modal [open]="open()" [title]="'Detalle de solicitud'" (close)="close.emit()">
      @if (loading()) {
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      } @else if (application()) {
        <div class="space-y-6">
          <div class="space-y-3">
            <h3 class="text-sm font-medium text-gray-500">Informacion de la solicitud</h3>
            <dl class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt class="text-gray-500">ID</dt>
                <dd class="text-gray-900 font-mono text-xs truncate">{{ application()!.id }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Cedula</dt>
                <dd class="text-gray-900">{{ application()!.cardId }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Monto</dt>
                <dd class="text-gray-900">{{ application()!.amount | currency:'USD':'symbol':'1.0-0' }}</dd>
              </div>
              <div>
                <dt class="text-gray-500">Plazo</dt>
                <dd class="text-gray-900">{{ application()!.term }} meses</dd>
              </div>
              <div>
                <dt class="text-gray-500">Estado</dt>
                <dd>
                  <span [class]="statusBadgeClass(application()!.status)">
                    {{ statusLabel(application()!.status) }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-gray-500">Fecha de creacion</dt>
                <dd class="text-gray-900">{{ application()!.createdAt | date:'medium' }}</dd>
              </div>
            </dl>
          </div>

          @if (application()!.user) {
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-gray-500">Informacion del usuario</h3>
              <dl class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt class="text-gray-500">Nombre</dt>
                  <dd class="text-gray-900">{{ application()!.user!.name }}</dd>
                </div>
                <div>
                  <dt class="text-gray-500">Email</dt>
                  <dd class="text-gray-900">{{ application()!.user!.email }}</dd>
                </div>
              </dl>
            </div>
          }

          @if (application()!.comment) {
            <div class="space-y-3">
              <h3 class="text-sm font-medium text-gray-500">Comentario</h3>
              <div class="p-3 rounded-lg bg-gray-50 border border-gray-200">
                <p class="text-sm text-gray-700">{{ application()!.comment }}</p>
              </div>
            </div>
          }

          @if (application()!.status === 'PENDING') {
            <div class="space-y-4 pt-4 border-t border-gray-200">
              <h3 class="text-sm font-medium text-gray-500">Cambiar estado</h3>
              <form [formGroup]="form" class="space-y-4" novalidate>
                <div class="space-y-1">
                  <label
                    for="comment"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Comentario
                  </label>

                  <textarea
                    id="comment"
                    rows="4"
                    placeholder="Ingrese un comentario..."
                    formControlName="comment"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  ></textarea>

                  @if (commentError()) {
                    <p class="text-sm text-red-600">
                      {{ commentError() }}
                    </p>
                  }
                </div>

                @if (error()) {
                  <div class="p-3 rounded-lg bg-red-50 border border-red-200" role="alert">
                    <p class="text-sm text-red-700">{{ error() }}</p>
                  </div>
                }

                <div class="flex gap-3 justify-end">
                  <ui-button variant="danger" [loading]="updating()" (click)="onApproveOrReject('REJECTED')">
                    Rechazar
                  </ui-button>
                  <ui-button variant="primary" [loading]="updating()" (click)="onApproveOrReject('APPROVED')">
                    Aprobar
                  </ui-button>
                </div>
              </form>
            </div>
          }
        </div>
      }
    </ui-modal>
  `,
})
export class CreditApplicationDetailWidget implements OnChanges {
  private service = inject(CreditApplicationService);
  private fb = inject(FormBuilder);

  open = input<boolean>(false);
  applicationId = input<string>('');
  close = output<void>();
  statusUpdated = output<void>();

  private applicationSignal = signal<CreditApplicationDetailResponse | null>(null);
  private updatingSignal = signal(false);

  application = this.applicationSignal.asReadonly();
  loading = this.service.loading;
  error = this.service.error;
  updating = this.updatingSignal.asReadonly();

  form = this.fb.group({
    comment: ['', [Validators.required]],
  });

  commentError(): string | undefined {
    const control = this.form.get('comment');
    if (control?.touched && control.hasError('required')) {
      return 'El comentario es requerido';
    }
    return undefined;
  }

  ngOnChanges(): void {
    if (this.applicationId() && this.open()) {
      this.loadApplication();
    }
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

  onApproveOrReject(status: 'APPROVED' | 'REJECTED'): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.updatingSignal.set(true);
    const comment = this.form.get('comment')!.value!;

    this.service.updateCreditApplicationStatus(this.applicationId(), { status, comment }).subscribe({
      next: () => {
        this.form.reset();
        this.updatingSignal.set(false);
        this.statusUpdated.emit();
        this.loadApplication();
      },
      error: () => {
        this.updatingSignal.set(false);
      },
    });
  }

  private loadApplication(): void {
    this.service.getCreditApplicationById(this.applicationId()).subscribe({
      next: (response) => {
        this.applicationSignal.set(response);
      },
    });
  }
}
