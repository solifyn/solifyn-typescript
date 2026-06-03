import { BaseService } from './base';

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  taxCategory: 'digital_products' | 'saas' | 'physical_products' | 'service';
  pricingType: 'usage_based' | 'one_time' | 'renewal' | 'addon';
  discount?: number;
  hasLicenseKey?: boolean;
  hasDigitalDelivery?: boolean;
  isTaxInclusive?: boolean;
  digitalLink?: string;
  instructions?: string;
  activationLimit?: number | null;
  activationMessage?: string;
  expiryValue?: string;
  expiryUnit?: string;
  brandId?: string | null;
  billingPeriod?: number | null;
  trialPeriodDays?: number | null;
  statementDescriptor?: string;
  payWhatYouWant?: boolean;
  metadata?: Record<string, any>;
  addons?: any[];
  customFields?: any[];
  stock?: number | null;
  isListed?: boolean;
  fileIds?: string[];
  productMeters?: any[];
  licenseKey?: string;
}

export interface ListProductsFilters {
  id?: string;
  query?: string;
  is_archived?: boolean;
  is_recurring?: boolean;
  page?: number;
  limit?: number;
  sorting?: 'created_at' | '-created_at' | 'name' | '-name' | 'price_amount' | '-price_amount';
  pricingType?: string;
}

export interface AddonInput {
  productId: string;
  minQuantity?: number;
  maxQuantity?: number | null;
  priceOverride?: number | null;
  isSeatAddon?: boolean;
}

export class ProductsService extends BaseService {
  async create(data: ProductInput): Promise<any> {
    return this.request<any>('POST', '/products', data);
  }

  async list(filters?: ListProductsFilters): Promise<any> {
    return this.request<any>('GET', '/products', undefined, filters);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/products/${id}`);
  }

  async update(id: string, data: Partial<ProductInput>): Promise<any> {
    return this.request<any>('PATCH', `/products/${id}`, data);
  }

  async archive(id: string): Promise<any> {
    return this.request<any>('DELETE', `/products/${id}`);
  }

  async unarchive(id: string): Promise<any> {
    return this.request<any>('POST', `/products/${id}/unarchive`);
  }

  // --- Addons ---
  async listAllAddons(): Promise<any[]> {
    return this.request<any[]>('GET', '/products/all-addons/list');
  }

  async listAddons(productId: string): Promise<any[]> {
    return this.request<any[]>('GET', `/products/${productId}/addons`);
  }

  async createAddon(productId: string, data: AddonInput): Promise<any> {
    return this.request<any>('POST', `/products/${productId}/addons`, data);
  }

  async getAddon(productId: string, addonId: string): Promise<any> {
    return this.request<any>('GET', `/products/${productId}/addons/${addonId}`);
  }

  async updateAddon(productId: string, addonId: string, data: Partial<AddonInput>): Promise<any> {
    return this.request<any>('PATCH', `/products/${productId}/addons/${addonId}`, data);
  }

  async deleteAddon(productId: string, addonId: string): Promise<any> {
    return this.request<any>('DELETE', `/products/${productId}/addons/${addonId}`);
  }
}
