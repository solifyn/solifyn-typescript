import { BaseService } from './base';

export interface DiscountInput {
  code: string;
  name: string;
  type: 'percentage' | 'fixed_amount';
  amount: number;
  usage_limit?: number | null;
  expires_at?: string | null;
}

export interface ListDiscountsFilters {
  id?: string;
  query?: string;
  page?: number;
  limit?: number;
  sorting?: 'created_at' | '-created_at';
}

export class DiscountsService extends BaseService {
  async create(data: DiscountInput): Promise<any> {
    return this.request<any>('POST', '/discounts', data);
  }

  async list(filters?: ListDiscountsFilters): Promise<any> {
    return this.request<any>('GET', '/discounts', undefined, filters);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/discounts/${id}`);
  }

  async update(id: string, data: Partial<DiscountInput>): Promise<any> {
    return this.request<any>('PATCH', `/discounts/${id}`, data);
  }

  async delete(id: string): Promise<any> {
    return this.request<any>('DELETE', `/discounts/${id}`);
  }

  async validate(code: string, businessId: string): Promise<any> {
    return this.request<any>('GET', '/discounts/validate', undefined, { code, businessId });
  }
}
