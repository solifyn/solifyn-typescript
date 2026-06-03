import { BaseService } from './base';

export interface ListDisputesFilters {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}

export interface DisputeReportFilters {
  createdAtGte?: string;
  createdAtLte?: string;
  status?: string;
}

export interface DisputeEvidenceInput {
  customerName?: string;
  customerEmail?: string;
  customerIpAddress?: string;
  shippingAddress?: string;
  billingAddress?: string;
  shippingDate?: string;
  trackingNumber?: string;
  serviceDate?: string;
  activityLog?: string;
  refundPolicy?: string;
  refundPolicyDisclosure?: string;
  cancellationPolicy?: string;
  cancellationPolicyDisclosure?: string;
  customerCommunication?: string;
  uncategorizedEvidence?: string;
  uncategorizedFileIds?: string[];
}

export class DisputesService extends BaseService {
  async list(filters?: ListDisputesFilters): Promise<any> {
    return this.request<any>('GET', '/transactions/disputes', undefined, filters as any);
  }

  async get(id: string): Promise<any> {
    return this.request<any>('GET', `/transactions/disputes/${id}`);
  }

  async getReport(filters?: DisputeReportFilters): Promise<any> {
    return this.request<any>('GET', '/transactions/disputes/report', undefined, filters as any);
  }

  async updateEvidence(id: string, data: DisputeEvidenceInput): Promise<any> {
    return this.request<any>('PATCH', `/transactions/disputes/${id}/evidence`, data);
  }

  async submitEvidence(id: string): Promise<any> {
    return this.request<any>('POST', `/transactions/disputes/${id}/submit`);
  }

  async uploadEvidenceFile(file: Blob, fileName: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file, fileName);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
    };

    const url = `${this.baseURL}/transactions/disputes/upload`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${errorText || response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(error.message || 'File upload request failed');
    }
  }
}
