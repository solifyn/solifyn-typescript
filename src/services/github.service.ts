import { BaseService } from './base';

export class GithubService extends BaseService {
  /**
   * Generates the URL to install the system-wide GitHub App onto the merchant's GitHub account/org.
   * @param productId Optional Product ID to redirect back to after installation
   */
  async getInstallUrl(productId?: string): Promise<{ url: string }> {
    return this.request<{ url: string }>(
      'GET',
      '/github/install',
      undefined,
      productId ? { productId } : undefined
    );
  }

  /**
   * Retrieves all repositories accessible by the merchant's installed GitHub App.
   */
  async listRepos(): Promise<{ id: number; fullName: string }[]> {
    return this.request<{ id: number; fullName: string }[]>('GET', '/github/repos');
  }
}
