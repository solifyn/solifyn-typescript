import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Solifyn } from '../src/client';
import { UnauthorizedError, ValidationError, CheckoutError } from '../src/errors';

describe('Solifyn SDK (Direct HTTP Provider)', () => {
  let solifyn: Solifyn;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = mockFetch;
    solifyn = new Solifyn({ apiKey: 'fyn_test_key', baseURL: 'http://localhost:8000' });
  });

  describe('Initialization', () => {
    it('should throw if API key is missing', () => {
      expect(() => new Solifyn({ apiKey: '' })).toThrow('Solifyn API key is required');
    });
  });

  describe('Checkout Service', () => {
    it('should successfully create checkout session', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ session_id: 'ch_123', checkout_url: 'https://solifyn.com/checkout/ch_123' }),
      });

      const result = await solifyn.checkout.createSession({
        productId: 'prod_123',
        quantity: 2,
        discountCode: 'SAVE10',
      });

      expect(result).toEqual({
        session_id: 'ch_123',
        checkout_url: 'https://solifyn.com/checkout/ch_123',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/checkout/create',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer fyn_test_key',
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            productId: 'prod_123',
            quantity: 2,
            discountCode: 'SAVE10',
          }),
        })
      );
    });

    it('should support backward compatible createCheckoutSession', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ session_id: 'ch_123', checkout_url: 'https://solifyn.com/checkout/ch_123' }),
      });

      const result = await solifyn.checkout.createCheckoutSession({
        productId: 'prod_123',
        price: 99.99,
        quantity: 1,
        options: {
          customerEmail: 'customer@example.com',
          metadata: { aff: 'affiliate_id' },
        },
      });

      expect(result).toEqual({
        id: 'ch_123',
        checkoutUrl: 'https://solifyn.com/checkout/ch_123',
        rawResponse: {
          session_id: 'ch_123',
          checkout_url: 'https://solifyn.com/checkout/ch_123',
        },
      });
    });
  });

  describe('Products Service', () => {
    it('should retrieve product list with query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ items: [{ id: 'prod_123', name: 'Product 1' }] }),
      });

      const result = await solifyn.products.list({ query: 'Product', page: 2 });

      expect(result).toEqual({ items: [{ id: 'prod_123', name: 'Product 1' }] });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/products?query=Product&page=2',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer fyn_test_key',
          }),
        })
      );
    });
  });

  describe('Licenses Service', () => {
    it('should verify license key', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ valid: true }),
      });

      const result = await solifyn.licenses.verify({
        productId: 'prod_123',
        key: 'LIC-KEY-123',
      });

      expect(result).toEqual({ valid: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/licenses/verify',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            productId: 'prod_123',
            key: 'LIC-KEY-123',
          }),
        })
      );
    });
  });

  describe('Discounts Service', () => {
    it('should validate discount code', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ valid: true, discount: { code: 'SAVE20', amount: 20 } }),
      });

      const result = await solifyn.discounts.validate('SAVE20', 'biz_123');

      expect(result).toEqual({
        valid: true,
        discount: { code: 'SAVE20', amount: 20 },
      });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/discounts/validate?code=SAVE20&businessId=biz_123',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Subscriptions Service', () => {
    it('should trigger pause action on subscription', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const result = await solifyn.subscriptions.executeAction('sub_123', 'pause');

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/subscriptions/sub_123/pause',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });

  describe('Meters Service', () => {
    it('should ingest meter event', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      const result = await solifyn.meters.ingest({
        customerId: 'cust_123',
        eventName: 'api_calls',
        value: 1,
      });

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/meters/ingest',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            customerId: 'cust_123',
            eventName: 'api_calls',
            value: 1,
          }),
        })
      );
    });
  });

  describe('Balances Service', () => {
    it('should get balance summary', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ pending: 100 }),
      });

      const result = await solifyn.balances.getSummary();

      expect(result).toEqual({ pending: 100 });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/balances/summary',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Digital Files Service', () => {
    it('should list digital files', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ([]),
      });

      const result = await solifyn.digitalFiles.list();

      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/digital-files',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Developer Service', () => {
    it('should list developer api keys', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ([]),
      });

      const result = await solifyn.developer.listKeys();

      expect(result).toEqual([]);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/developer/api-keys',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Disputes Service', () => {
    it('should list disputes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ items: [] }),
      });

      const result = await solifyn.disputes.list({ status: 'warning' });

      expect(result).toEqual({ items: [] });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/transactions/disputes?status=warning',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Refunds Service', () => {
    it('should retrieve refund details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'ref_123' }),
      });

      const result = await solifyn.refunds.get('ref_123');

      expect(result).toEqual({ id: 'ref_123' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/refunds/ref_123',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Orders Service', () => {
    it('should list orders with filters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ items: [{ id: 'pay_123', status: 'paid' }] }),
      });

      const result = await solifyn.orders.list({ pageNumber: 1, pageSize: 5 });

      expect(result).toEqual({ items: [{ id: 'pay_123', status: 'paid' }] });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/orders?pageNumber=1&pageSize=5',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should retrieve specific order details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'pay_123' }),
      });

      const result = await solifyn.orders.get('pay_123');

      expect(result).toEqual({ id: 'pay_123' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/orders/pay_123',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should update billing details of an order', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'pay_123', billingAddress: { country: 'US' } }),
      });

      const result = await solifyn.orders.updateBilling('pay_123', {
        billing: { country: 'US' },
      });

      expect(result).toEqual({ id: 'pay_123', billingAddress: { country: 'US' } });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/orders/pay_123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ billing: { country: 'US' } }),
        })
      );
    });

    it('should create order refund', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ success: true }),
      });

      const result = await solifyn.orders.refund('pay_123', {
        amount: 10,
        isFullRefund: false,
        idempotencyKey: 'idem_123',
      });

      expect(result).toEqual({ success: true });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/orders/pay_123/refund',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ amount: 10, isFullRefund: false, idempotencyKey: 'idem_123' }),
        })
      );
    });

    it('should fetch order invoice', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'inv_pay_123', order_id: 'pay_123' }),
      });

      const result = await solifyn.orders.getInvoice('pay_123');

      expect(result).toEqual({ id: 'inv_pay_123', order_id: 'pay_123' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/orders/pay_123/invoice',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });
  });

  describe('Brands Service', () => {
    it('should successfully create brand', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({ id: 'brd_123', name: 'Brand 1' }),
      });

      const result = await solifyn.brands.create({
        name: 'Brand 1',
        websiteUrl: 'https://brand1.com',
      });

      expect(result).toEqual({ id: 'brd_123', name: 'Brand 1' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/user/brand',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'Brand 1', websiteUrl: 'https://brand1.com' }),
        })
      );
    });

    it('should list all brands', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => [{ id: 'brd_123', name: 'Brand 1' }],
      });

      const result = await solifyn.brands.list();

      expect(result).toEqual([{ id: 'brd_123', name: 'Brand 1' }]);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/user/brands',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should retrieve specific brand by ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'brd_123', name: 'Brand 1' }),
      });

      const result = await solifyn.brands.get('brd_123');

      expect(result).toEqual({ id: 'brd_123', name: 'Brand 1' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/user/brand/brd_123',
        expect.objectContaining({
          method: 'GET',
        })
      );
    });

    it('should update specific brand details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ id: 'brd_123', name: 'Brand Updated' }),
      });

      const result = await solifyn.brands.update('brd_123', {
        name: 'Brand Updated',
      });

      expect(result).toEqual({ id: 'brd_123', name: 'Brand Updated' });
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/v1/user/brand/brd_123',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ name: 'Brand Updated' }),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw UnauthorizedError on 401 response status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({ message: 'Invalid API Key' }),
      });

      await expect(solifyn.products.list()).rejects.toThrow(UnauthorizedError);
    });

    it('should throw ValidationError on 400 response status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Validation failed' }),
      });

      await expect(solifyn.products.create({} as any)).rejects.toThrow(ValidationError);
    });

    it('should throw CheckoutError on other response status codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Crash' }),
      });

      await expect(solifyn.products.list()).rejects.toThrow(CheckoutError);
    });
  });
});
