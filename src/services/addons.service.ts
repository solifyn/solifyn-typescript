import { BaseService } from './base';
import { AddonInput } from './products.service';

export class AddonsService extends BaseService {
  async listAll(): Promise<any[]> {
    return this.request<any[]>('GET', '/products/all-addons/list');
  }

  async list(productId: string): Promise<any[]> {
    return this.request<any[]>('GET', `/products/${productId}/addons`);
  }

  async create(productId: string, data: AddonInput): Promise<any> {
    return this.request<any>('POST', `/products/${productId}/addons`, data);
  }

  async get(productId: string, addonId: string): Promise<any> {
    return this.request<any>('GET', `/products/${productId}/addons/${addonId}`);
  }

  async update(productId: string, addonId: string, data: Partial<AddonInput>): Promise<any> {
    return this.request<any>('PATCH', `/products/${productId}/addons/${addonId}`, data);
  }

  async delete(productId: string, addonId: string): Promise<any> {
    return this.request<any>('DELETE', `/products/${productId}/addons/${addonId}`);
  }
}
