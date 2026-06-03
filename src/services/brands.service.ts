import { BaseService } from './base';

export interface BrandInput {
  name: string;
  websiteUrl?: string;
  supportEmail?: string;
  description?: string;
  logoUrl?: string;
  statementDescriptor?: string;
}

export class BrandsService extends BaseService {
  async create(data: BrandInput): Promise<any> {
    return this.request<any>('POST', '/user/brand', data);
  }

  async list(): Promise<any[]> {
    return this.request<any[]>('GET', '/user/brands');
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/user/brand/${id}`);
  }

  async update(id: string, data: Partial<BrandInput>): Promise<any> {
    return this.request<any>('PATCH', `/user/brand/${id}`, data);
  }
}
