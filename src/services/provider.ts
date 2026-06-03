import { BaseService } from './base';

/**
 * @deprecated Legacy PaymentProvider. Use `CheckoutService` instead for robust checkout session generation.
 */
export class PaymentProvider extends BaseService {
  /**
   * @deprecated Use `CheckoutService.createSession` or `CheckoutService.createCheckoutSession` instead.
   */
  async createCheckoutSession(input: any): Promise<any> {
    const data = {
      productId: input.productId,
      quantity: input.quantity || 1,
      customPrice: input.price,
      customerEmail: input.options?.customerEmail,
      aff: input.options?.metadata?.aff,
      customFields: input.options?.metadata,
    };
    const response = await this.request<any>('POST', '/checkout/create', data);
    return {
      id: response.session_id || response.whopSessionId || response.id,
      checkoutUrl: response.checkout_url || response.checkoutUrl,
      rawResponse: response,
    };
  }
}
