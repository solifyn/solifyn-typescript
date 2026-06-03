import { BaseService } from './base';

export interface SubmitRefundRequestInput {
  token: string;
  paymentId: string;
  reason: string;
  description: string;
  evidenceUrls?: string[];
}

export interface SendPortalMessageInput {
  token: string;
  message: string;
  evidenceUrls?: string[];
}

export interface SendMerchantMessageInput {
  message: string;
  evidenceUrls?: string[];
}

export class RefundRequestsService extends BaseService {
  // --- Customer / Portal APIs ---

  async portalUploadEvidence(file: File | Blob, token: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);
    return this.request<any>('POST', '/customers/customer-portal/upload-evidence', formData);
  }

  async portalSubmitRequest(data: SubmitRefundRequestInput): Promise<any> {
    return this.request<any>('POST', '/customers/customer-portal/refund-requests', data);
  }

  async portalAddMessage(id: string, data: SendPortalMessageInput): Promise<any> {
    return this.request<any>('POST', `/customers/customer-portal/refund-requests/${id}/messages`, data);
  }

  async portalCancelRequest(id: string, token: string): Promise<any> {
    return this.request<any>('POST', `/customers/customer-portal/refund-requests/${id}/cancel`, { token });
  }

  async portalGetMessages(id: string, token: string): Promise<any> {
    return this.request<any>('POST', `/customers/customer-portal/refund-requests/${id}/get-messages`, { token });
  }

  // --- Merchant Dashboard APIs ---

  async uploadEvidence(file: File | Blob, businessId?: string): Promise<any> {
    const headers = businessId ? { 'x-business-id': businessId } : undefined;
    const formData = new FormData();
    formData.append('file', file);
    return this.request<any>('POST', '/refund-requests/upload-evidence', formData, undefined, headers);
  }

  async list(businessId?: string): Promise<any[]> {
    const headers = businessId ? { 'x-business-id': businessId } : undefined;
    return this.request<any[]>('GET', '/refund-requests', undefined, undefined, headers);
  }

  async updateStatus(
    id: string,
    status: 'PENDING' | 'MORE_INFO_NEEDED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CLOSED',
    businessId?: string,
  ): Promise<any> {
    const headers = businessId ? { 'x-business-id': businessId } : undefined;
    return this.request<any>('PATCH', `/refund-requests/${id}/status`, { status }, undefined, headers);
  }

  async getMessages(id: string, businessId?: string): Promise<any> {
    const headers = businessId ? { 'x-business-id': businessId } : undefined;
    return this.request<any>('GET', `/refund-requests/${id}/messages`, undefined, undefined, headers);
  }

  async addMessage(id: string, data: SendMerchantMessageInput, businessId?: string): Promise<any> {
    const headers = businessId ? { 'x-business-id': businessId } : undefined;
    return this.request<any>('POST', `/refund-requests/${id}/messages`, data, undefined, headers);
  }
}
