import { BaseService } from './base';

export interface CreateApiKeyInput {
  name: string;
  allowWrite?: boolean;
}

export interface CreateWebhookInput {
  url: string;
  description?: string;
  events: string[];
}

export interface UpdateWebhookInput {
  url?: string;
  description?: string;
  events?: string[];
  status?: string;
}

export class DeveloperService extends BaseService {
  // API Keys
  async listKeys(): Promise<any[]> {
    return this.request<any[]>('GET', '/developer/api-keys');
  }

  async createKey(data: CreateApiKeyInput): Promise<any> {
    return this.request<any>('POST', '/developer/api-keys', data);
  }

  async revokeKey(id: string): Promise<any> {
    return this.request<any>('DELETE', `/developer/api-keys/${id}`);
  }

  // Webhooks
  async getAppPortal(): Promise<any> {
    return this.request<any>('GET', '/developer/webhooks/app-portal');
  }

  async listWebhooks(): Promise<any[]> {
    return this.request<any[]>('GET', '/developer/webhooks');
  }

  async createWebhook(data: CreateWebhookInput): Promise<any> {
    return this.request<any>('POST', '/developer/webhooks', data);
  }

  async updateWebhook(id: string, data: UpdateWebhookInput): Promise<any> {
    return this.request<any>('PATCH', `/developer/webhooks/${id}`, data);
  }

  async deleteWebhook(id: string): Promise<any> {
    return this.request<any>('DELETE', `/developer/webhooks/${id}`);
  }

  async listDeliveries(webhookId: string): Promise<any[]> {
    return this.request<any[]>('GET', `/developer/webhooks/${webhookId}/deliveries`);
  }
}
