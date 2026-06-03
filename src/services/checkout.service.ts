import { BaseService } from './base';

export interface CreateCheckoutInput {
  productId: string;
  quantity?: number;
  discountCode?: string;
  customPrice?: number;
  customerEmail?: string;
  checkoutData?: Record<string, any>;
  customFields?: Record<string, any>;
  aff?: string;
  checkoutId?: string;
}

export interface CreateCollectionCheckoutInput {
  collectionId: string;
  quantity?: number;
  discountCode?: string;
  aff?: string;
  customFields?: Record<string, any>;
}

export interface PricePreviewParams {
  productId: string;
  currency?: string;
  discount?: number;
  qty?: number;
  customPrice?: number;
  addons?: string;
}

export class CheckoutService extends BaseService {
  async getSession(sessionId: string): Promise<any> {
    return this.request<any>('GET', `/checkout/session/${sessionId}`);
  }

  async getSupportedCurrencies(): Promise<any[]> {
    return this.request<any[]>('GET', '/checkout/supported-currencies');
  }

  async getPricePreview(params: PricePreviewParams): Promise<any> {
    return this.request<any>('GET', '/checkout/price-preview', undefined, params as any);
  }

  async createSession(data: CreateCheckoutInput): Promise<any> {
    return this.request<any>('POST', '/checkout/create', data);
  }

  // Backward-compatible method mapping legacy Whop inputs to direct checkout sessions
  async createCheckoutSession(input: any): Promise<any> {
    const data: CreateCheckoutInput = {
      productId: input.productId,
      quantity: input.quantity || 1,
      customPrice: input.price,
      customerEmail: input.options?.customerEmail,
      aff: input.options?.metadata?.aff,
      customFields: input.options?.metadata,
    };
    const response = await this.createSession(data);
    return {
      id: response.session_id || response.whopSessionId || response.id,
      checkoutUrl: response.checkout_url || response.checkoutUrl,
      rawResponse: response,
    };
  }

  async createCollectionSession(data: CreateCollectionCheckoutInput): Promise<any> {
    return this.request<any>('POST', '/checkout/collection/create', data);
  }
}
