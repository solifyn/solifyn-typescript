import { CheckoutError, UnauthorizedError, ValidationError } from '../errors';

export class BaseService {
  protected apiKey: string;
  protected baseURL: string;

  constructor(apiKey: string, baseURL?: string) {
    this.apiKey = apiKey;
    
    let defaultURL = 'https://api.solifyn.com';
    if (typeof process !== 'undefined' && process.env) {
      if (process.env.SOLIFYN_API_URL) {
        defaultURL = process.env.SOLIFYN_API_URL;
      } else if (process.env.NEXT_PUBLIC_SOLIFYN_API_URL) {
        defaultURL = process.env.NEXT_PUBLIC_SOLIFYN_API_URL;
      } else if (process.env.NODE_ENV === 'development') {
        defaultURL = 'http://localhost:8000';
      }
    }
    
    this.baseURL = (baseURL || defaultURL).replace(/\/$/, '') + '/v1';
  }

  protected async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: any,
    queryParams?: Record<string, any>,
    extraHeaders?: Record<string, string>
  ): Promise<T> {
    let url = `${this.baseURL}${path}`;
    if (queryParams) {
      const filteredParams = Object.entries(queryParams)
        .filter(([_, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      if (filteredParams.length > 0) {
        url += `?${filteredParams.join('&')}`;
      }
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Accept': 'application/json',
      ...extraHeaders,
    };

    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    if (body !== undefined && !isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const options: RequestInit = {
      method,
      headers,
      body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
    };

    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errorData: any = {};
        try {
          errorData = await response.json();
        } catch (_) {}

        const message = errorData?.message || response.statusText || 'Unknown API Error';
        if (response.status === 401) {
          throw new UnauthorizedError(message);
        } else if (response.status === 400) {
          throw new ValidationError(message);
        } else {
          throw new CheckoutError(message, 'API_ERROR', response.status);
        }
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json() as T;
    } catch (error: any) {
      if (error instanceof CheckoutError) {
        throw error;
      }
      throw new CheckoutError(error.message || 'Network Request Failed', 'NETWORK_ERROR', 500);
    }
  }
}
