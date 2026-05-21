import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CreditApplicationDto } from '../dtos/credit-application.dto';
import { PaginationDto } from '../dtos/pagination.dto';
import { UserDto } from '../../../auth';

export interface CreateCreditApplicationPayload {
  amount: number;
  term: number;
  cardId: string;
}

export interface GetCreditApplicationsParams {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  limit?: number;
  page?: number;
}

export interface CreditApplicationsResponse {
  data: CreditApplicationDto[];
  pagination: PaginationDto;
}

export interface CreditApplicationDetailResponse extends CreditApplicationDto {
  user: UserDto | null;
}

export interface UpdateStatusPayload {
  status: 'APPROVED' | 'REJECTED';
  comment: string;
}

@Injectable({ providedIn: 'root' })
export class CreditApplicationApiService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/credit-applications`;

  create(data: CreateCreditApplicationPayload): Observable<CreditApplicationDto> {
    return this.http.post<CreditApplicationDto>(this.baseUrl, data);
  }

  getAll(params: GetCreditApplicationsParams): Observable<CreditApplicationsResponse> {
    let httpParams = new HttpParams();

    if (params.status) {
      httpParams = httpParams.set('status', params.status);
    }
    if (params.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }

    return this.http.get<CreditApplicationsResponse>(this.baseUrl, { params: httpParams });
  }

  getById(id: string): Observable<CreditApplicationDetailResponse> {
    return this.http.get<CreditApplicationDetailResponse>(`${this.baseUrl}/${id}`);
  }

  updateStatus(id: string, data: UpdateStatusPayload): Observable<CreditApplicationDto> {
    return this.http.patch<CreditApplicationDto>(`${this.baseUrl}/${id}/status`, data);
  }
}
