import { BaseService } from './base';

export interface CustomerInput {
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, any>;
}

export class CustomersService extends BaseService {
  async create(data: CustomerInput): Promise<any> {
    return this.request<any>('POST', '/customers', data);
  }

  async list(filters?: Record<string, any>): Promise<any> {
    return this.request<any>('GET', '/customers', undefined, filters);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/customers/${id}`);
  }

  async update(id: string, data: Partial<CustomerInput>): Promise<any> {
    return this.request<any>('PATCH', `/customers/${id}`, data);
  }

  async generateInvite(id: string): Promise<any> {
    return this.request<any>('POST', `/customers/${id}/share`);
  }

  async getSharedData(token: string): Promise<any> {
    return this.request<any>('GET', `/customers/customer-portal/${token}`);
  }

  async portalLoginRequest(email: string, token?: string, businessId?: string): Promise<any> {
    return this.request<any>('POST', '/customers/customer-portal/login-request', { email, token, businessId });
  }

  async portalLoginVerify(email: string, code: string, token?: string, businessId?: string): Promise<any> {
    return this.request<any>('POST', '/customers/customer-portal/login-verify', { email, code, token, businessId });
  }

  async portalCancelSubscription(subscriptionId: string, token: string): Promise<any> {
    return this.request<any>('POST', `/customers/customer-portal/subscriptions/${subscriptionId}/cancel`, { token });
  }

  async generateCustomerPortalSession(businessId: string): Promise<any> {
    return this.request<any>('POST', '/customers/customer-portal/session', { businessId });
  }
}
