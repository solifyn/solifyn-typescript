export class CheckoutError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code = 'CHECKOUT_ERROR', statusCode = 400) {
    super(message);
    this.name = 'CheckoutError';
    this.code = code;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends CheckoutError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

export class ProviderError extends CheckoutError {
  constructor(message: string, statusCode = 400) {
    super(message, 'PROVIDER_ERROR', statusCode);
  }
}

export class ValidationError extends CheckoutError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}
