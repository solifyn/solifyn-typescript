import { BaseService } from './base';

export interface ListOrdersFilters {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  customer_id?: string;
  product_id?: string;
  createdAtGte?: string;
  createdAtLte?: string;
}

export interface UpdateOrderBillingInput {
  billing?: {
    street?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  };
}

export interface OrderRefundInput {
  amount: number;
  isFullRefund: boolean;
  idempotencyKey: string;
  autoRevokeSeats?: boolean;
}

export class OrdersService extends BaseService {
  async list(filters?: ListOrdersFilters): Promise<any> {
    return this.request<any>('GET', '/orders', null, filters);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/orders/${id}`);
  }

  async updateBilling(id: string, data: UpdateOrderBillingInput): Promise<any> {
    return this.request<any>('PATCH', `/orders/${id}`, data);
  }

  async refund(id: string, data: OrderRefundInput): Promise<any> {
    return this.request<any>('POST', `/orders/${id}/refund`, data);
  }

  async getInvoice(id: string): Promise<any> {
    return this.request<any>('GET', `/orders/${id}/invoice`);
  }
}
