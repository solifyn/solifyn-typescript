import { BaseService } from './base';

export interface Entitlement {
  id: string;
  businessId: string;
  name: string;
  type: 'GITHUB' | 'DISCORD' | 'FRAMER' | 'LICENSE' | 'DIGITAL';
  status: 'ACTIVE' | 'DISABLED';
  githubRepo?: string;
  githubPermission?: string;
  discordRoleId?: string;
  discordGuildId?: string;
  framerTemplateId?: string;
  licenseKey?: string;
  activationLimit?: number | null;
  activationMessage?: string | null;
  expiryHours?: number | null;
  digitalLink?: string;
  instructions?: string | null;
  productIds?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEntitlementPayload {
  name: string;
  type: 'GITHUB' | 'DISCORD' | 'FRAMER' | 'LICENSE' | 'DIGITAL';
  status: 'ACTIVE' | 'DISABLED';
  githubRepo?: string;
  githubPermission?: string;
  discordRoleId?: string;
  discordGuildId?: string;
  framerTemplateId?: string;
  licenseKey?: string;
  activationLimit?: number | null;
  activationMessage?: string | null;
  expiryHours?: number | null;
  digitalLink?: string;
  instructions?: string | null;
  productIds?: string[];
}

export interface UpdateEntitlementPayload extends Partial<CreateEntitlementPayload> {}

export class EntitlementsService extends BaseService {
  /**
   * List all independent access entitlements for the active business.
   */
  async list(): Promise<Entitlement[]> {
    return this.request<Entitlement[]>('GET', '/entitlements');
  }

  /**
   * Retrieve a specific entitlement definition by ID.
   */
  async get(id: string): Promise<Entitlement> {
    return this.request<Entitlement>('GET', `/entitlements/${id}`);
  }

  /**
   * Create a new independent access entitlement.
   */
  async create(payload: CreateEntitlementPayload): Promise<Entitlement> {
    return this.request<Entitlement>('POST', '/entitlements', payload);
  }

  /**
   * Update details of an existing independent entitlement.
   */
  async update(id: string, payload: UpdateEntitlementPayload): Promise<Entitlement> {
    return this.request<Entitlement>('PATCH', `/entitlements/${id}`, payload);
  }

  /**
   * Delete an independent entitlement and unlink all mapped products.
   */
  async delete(id: string): Promise<Entitlement> {
    return this.request<Entitlement>('DELETE', `/entitlements/${id}`);
  }
}
