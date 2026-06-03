import { BaseService } from './base';

export interface CheckoutLinkInput {
  productId: string;
  title: string;
  priceOverride?: number | null;
  redirectionUrl?: string;
  allowedDiscountCodes?: string[];
  expiresAt?: string | null;
}

export class CheckoutLinksService extends BaseService {
  async create(data: CheckoutLinkInput): Promise<any> {
    return this.request<any>('POST', '/checkout-links', data);
  }

  async list(): Promise<any[]> {
    return this.request<any[]>('GET', '/checkout-links');
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/checkout-links/${id}`);
  }

  async update(id: string, data: Partial<CheckoutLinkInput>): Promise<any> {
    return this.request<any>('PATCH', `/checkout-links/${id}`, data);
  }

  async delete(id: string): Promise<any> {
    return this.request<any>('DELETE', `/checkout-links/${id}`);
  }
}
