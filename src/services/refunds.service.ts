import { BaseService } from './base';

export class RefundsService extends BaseService {
  async list(filters?: any): Promise<any[]> {
    return this.request<any[]>('GET', '/refunds', undefined, filters);
  }

  async getReport(filters?: any): Promise<any> {
    return this.request<any>('GET', '/refunds/report', undefined, filters);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/refunds/${id}`);
  }

  async getReceipt(id: string): Promise<any> {
    return this.request<any>('GET', `/refunds/${id}/receipt`);
  }
}
