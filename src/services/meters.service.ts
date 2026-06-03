import { BaseService } from './base';

export interface MeterInput {
  name: string;
  eventName: string;
  aggregationType: 'sum' | 'count' | 'latest' | 'max';
  description?: string;
}

export interface MeterIngestInput {
  customerId: string;
  eventName: string;
  value?: number;
  timestamp?: string;
  idempotencyKey?: string;
}

export class MetersService extends BaseService {
  async list(filters?: any): Promise<any[]> {
    return this.request<any[]>('GET', '/meters', undefined, filters);
  }

  async create(data: MeterInput): Promise<any> {
    return this.request<any>('POST', '/meters', data);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/meters/${id}`);
  }

  async update(id: string, data: Partial<MeterInput>): Promise<any> {
    return this.request<any>('PATCH', `/meters/${id}`, data);
  }

  async listEvents(id: string, queryParams?: any): Promise<any[]> {
    return this.request<any[]>('GET', `/meters/${id}/events`, undefined, queryParams);
  }

  async getQuantities(id: string, queryParams?: any): Promise<any[]> {
    return this.request<any[]>('GET', `/meters/${id}/quantities`, undefined, queryParams);
  }

  async ingest(data: MeterIngestInput): Promise<any> {
    return this.request<any>('POST', '/meters/ingest', data);
  }
}
