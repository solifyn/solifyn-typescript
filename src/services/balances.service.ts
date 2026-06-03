import { BaseService } from './base';

export class BalancesService extends BaseService {
  async list(filters?: any): Promise<any[]> {
    return this.request<any[]>('GET', '/balances', undefined, filters);
  }

  async getSummary(): Promise<any> {
    return this.request<any>('GET', '/balances/summary');
  }

  async getReport(filters?: any): Promise<any> {
    return this.request<any>('GET', '/balances/report', undefined, filters);
  }
}
