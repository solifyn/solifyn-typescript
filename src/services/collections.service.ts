import { BaseService } from './base';

export interface CollectionInput {
  name: string;
  description?: string;
  isListed?: boolean;
  theme?: string;
  products?: { productId: string; quantity?: number }[];
}

export interface AddCollectionProductsInput {
  products: { productId: string; quantity?: number }[];
}

export class CollectionsService extends BaseService {
  async create(data: CollectionInput): Promise<any> {
    return this.request<any>('POST', '/collections', data);
  }

  async list(): Promise<any[]> {
    return this.request<any[]>('GET', '/collections');
  }

  async listArchived(): Promise<any[]> {
    return this.request<any[]>('GET', '/collections/archived');
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/collections/${id}`);
  }

  async update(id: string, data: Partial<CollectionInput>): Promise<any> {
    return this.request<any>('PATCH', `/collections/${id}`, data);
  }

  async archive(id: string): Promise<any> {
    return this.request<any>('DELETE', `/collections/${id}`);
  }

  async unarchive(id: string): Promise<any> {
    return this.request<any>('POST', `/collections/${id}/unarchive`);
  }

  async duplicate(id: string): Promise<any> {
    return this.request<any>('POST', `/collections/${id}/duplicate`);
  }

  async addProducts(id: string, data: AddCollectionProductsInput): Promise<any> {
    return this.request<any>('POST', `/collections/${id}/products`, data);
  }

  async updateProduct(id: string, productId: string, quantity: number): Promise<any> {
    return this.request<any>('PATCH', `/collections/${id}/products/${productId}`, { quantity });
  }

  async deleteProduct(id: string, productId: string): Promise<any> {
    return this.request<any>('DELETE', `/collections/${id}/products/${productId}`);
  }

  // Public/Storefront operations
  async listPublic(subdomain: string): Promise<any[]> {
    return this.request<any[]>('GET', `/collections/public/${subdomain}`);
  }

  async getPublic(subdomain: string, id: string): Promise<any> {
    return this.request<any>('GET', `/collections/public/${subdomain}/${id}`);
  }

  async getDetails(id: string): Promise<any> {
    return this.request<any>('GET', `/collections/details/${id}`);
  }
}
