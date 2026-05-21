export interface CreditApplicationDto {
  id: string;
  amount: number;
  term: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  cardId: string;
  userId: string | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}
