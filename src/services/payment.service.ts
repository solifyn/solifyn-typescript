import { PaymentProvider } from './provider';

/**
 * @deprecated Legacy PaymentService. Use `CheckoutService` instead.
 */
export class PaymentService {
  constructor(public readonly provider: PaymentProvider) {}

  async createCheckoutSession(input: any): Promise<any> {
    return this.provider.createCheckoutSession(input);
  }
}
