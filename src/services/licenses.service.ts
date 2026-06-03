import { BaseService } from './base';

export interface CreateLicenseInput {
  productId: string;
  key?: string;
  status?: 'ACTIVE' | 'DISABLED' | 'EXPIRED';
  expiryHours?: number;
  activationLimit?: number;
  activationMessage?: string;
  paymentId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateLicenseInput {
  status?: 'ACTIVE' | 'DISABLED' | 'EXPIRED';
  expiryHours?: number;
  activationLimit?: number;
  activationMessage?: string;
  metadata?: Record<string, any>;
}

export interface VerifyLicenseInput {
  productId: string;
  key: string;
  paymentId?: string;
}

export interface ActivateLicenseInput {
  productId?: string;
  key: string;
  deviceIdentifier: string; // instanceId
  name?: string; // instanceName
  paymentId?: string;
}

export interface DeactivateInstanceInput {
  key?: string; // licenseKey
}

export class LicensesService extends BaseService {
  // Administrative Operations
  async create(data: CreateLicenseInput): Promise<any> {
    return this.request<any>('POST', '/licenses', data);
  }

  async list(): Promise<any[]> {
    return this.request<any[]>('GET', '/licenses');
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/licenses/${id}`);
  }

  async update(id: string, data: UpdateLicenseInput): Promise<any> {
    return this.request<any>('PATCH', `/licenses/${id}`, data);
  }

  async toggleStatus(id: string): Promise<any> {
    return this.request<any>('POST', `/licenses/${id}/toggle`);
  }

  async getInstancesAdmin(id: string): Promise<any[]> {
    return this.request<any[]>('GET', `/licenses/${id}/instances`);
  }

  async getInstanceAdmin(id: string, instanceId: string): Promise<any> {
    return this.request<any>('GET', `/licenses/${id}/instances/${instanceId}`);
  }

  async updateInstanceAdmin(id: string, instanceId: string, data: any): Promise<any> {
    return this.request<any>('PATCH', `/licenses/${id}/instances/${instanceId}`, data);
  }

  async forceDeleteInstanceAdmin(instanceId: string): Promise<any> {
    return this.request<any>('DELETE', `/licenses/instances/${instanceId}`);
  }

  // Client/Public Operations
  async verify(data: VerifyLicenseInput): Promise<any> {
    return this.request<any>('POST', '/licenses/verify', data);
  }

  async activate(data: ActivateLicenseInput): Promise<any> {
    return this.request<any>('POST', '/licenses/activate', data);
  }

  async getInstancesClient(licenseId: string): Promise<any[]> {
    return this.request<any[]>('GET', `/licenses/instances/${licenseId}`);
  }

  async deactivateInstanceClient(instanceId: string, data?: DeactivateInstanceInput): Promise<any> {
    return this.request<any>('POST', `/licenses/deactivate/${instanceId}`, data);
  }
}
