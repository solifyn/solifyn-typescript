import { BaseService } from './base';

export interface EntitlementGrant {
  id: string;
  businessId: string;
  customerId: string;
  githubRepo: string;
  githubUsername: string;
  githubPermission: string;
  status: 'PENDING' | 'DELIVERED' | 'FAILED' | 'REVOKED';
  oauthUrl: string | null;
  errorDetails: string | null;
  createdAt: string;
  updatedAt: string;
}

export class EntitlementGrantsService extends BaseService {
  /**
   * List all GitHub repository entitlement grants for the active business.
   * @param status Optional filter by status (PENDING, DELIVERED, FAILED, REVOKED)
   */
  async list(status?: string): Promise<EntitlementGrant[]> {
    return this.request<EntitlementGrant[]>(
      'GET',
      '/entitlement-grants',
      undefined,
      status ? { status } : undefined
    );
  }

  /**
   * Retrieve details of a specific entitlement grant.
   */
  async get(id: string): Promise<EntitlementGrant> {
    return this.request<EntitlementGrant>('GET', `/entitlement-grants/${id}`);
  }

  /**
   * Manually remove the customer collaborator access from the repository and revoke the grant.
   */
  async revoke(id: string): Promise<EntitlementGrant> {
    return this.request<EntitlementGrant>('POST', `/entitlement-grants/${id}/revoke`);
  }

  /**
   * Attempts to re-invite the collaborator or resets the OAuth URL redirect.
   */
  async retry(id: string): Promise<EntitlementGrant> {
    return this.request<EntitlementGrant>('POST', `/entitlement-grants/${id}/retry`);
  }
}
