import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  CreditApplicationApiService,
  CreateCreditApplicationPayload,
  GetCreditApplicationsParams,
  CreditApplicationsResponse,
  CreditApplicationDetailResponse,
  UpdateStatusPayload,
} from '../api/services/credit-application.api.service';
import { CreditApplicationDto } from '../api/dtos/credit-application.dto';

@Injectable({ providedIn: 'root' })
export class CreditApplicationService {
  private api = inject(CreditApplicationApiService);

  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

  createCreditApplication(data: CreateCreditApplicationPayload): Observable<CreditApplicationDto> {
    this.setLoading(true);
    this.clearError();
    return this.api.create(data).pipe(
      tap({
        error: (err) => this.setError(err.error.message || 'Error creating credit application'),
        finalize: () => this.setLoading(false),
      })
    );
  }

  getCreditApplications(params: GetCreditApplicationsParams): Observable<CreditApplicationsResponse> {
    this.setLoading(true);
    this.clearError();
    return this.api.getAll(params).pipe(
      tap({
        error: (err) => this.setError(err.error.message || 'Error fetching credit applications'),
        finalize: () => this.setLoading(false),
      })
    );
  }

  getCreditApplicationById(id: string): Observable<CreditApplicationDetailResponse> {
    this.setLoading(true);
    this.clearError();
    return this.api.getById(id).pipe(
      tap({
        error: (err) => this.setError(err.error.message || 'Error fetching credit application'),
        finalize: () => this.setLoading(false),
      })
    );
  }

  updateCreditApplicationStatus(id: string, data: UpdateStatusPayload): Observable<CreditApplicationDto> {
    this.setLoading(true);
    this.clearError();
    return this.api.updateStatus(id, data).pipe(
      tap({
        error: (err) => this.setError(err.error.message || 'Error updating credit application status'),
        finalize: () => this.setLoading(false),
      })
    );
  }

  private setLoading(loading: boolean): void {
    this.loadingSignal.set(loading);
  }

  private setError(error: string): void {
    this.errorSignal.set(error);
  }

  private clearError(): void {
    this.errorSignal.set(null);
  }
}
