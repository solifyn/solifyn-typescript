import { BaseService } from './base';

export interface ListSubscriptionsFilters {
  customerId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export type SubscriptionAction = 'pause' | 'resume' | 'cancel' | 'uncancel';

export class SubscriptionsService extends BaseService {
  async list(filters?: ListSubscriptionsFilters): Promise<any> {
    return this.request<any>('GET', '/subscriptions', undefined, filters as any);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/subscriptions/${id}`);
  }

  async executeAction(subscriptionId: string, action: SubscriptionAction, body?: any): Promise<any> {
    return this.request<any>('POST', `/subscriptions/${subscriptionId}/${action}`, body);
  }
}
