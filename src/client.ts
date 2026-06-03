import { ProductsService } from './services/products.service';
import { LicensesService } from './services/licenses.service';
import { DiscountsService } from './services/discounts.service';
import { CheckoutLinksService } from './services/checkout-links.service';
import { CustomersService } from './services/customers.service';
import { CollectionsService } from './services/collections.service';
import { CheckoutService } from './services/checkout.service';
import { SubscriptionsService } from './services/subscriptions.service';
import { AddonsService } from './services/addons.service';
import { MetersService } from './services/meters.service';
import { BalancesService } from './services/balances.service';
import { DigitalFilesService } from './services/digital-files.service';
import { DeveloperService } from './services/developer.service';
import { DisputesService } from './services/disputes.service';
import { RefundsService } from './services/refunds.service';
import { OrdersService } from './services/orders.service';
import { BrandsService } from './services/brands.service';
import { RefundRequestsService } from './services/refund-requests.service';

export interface SolifynConfig {
  apiKey: string;
  baseURL?: string;
}

export class Solifyn {
  public readonly products: ProductsService;
  public readonly licenses: LicensesService;
  public readonly discounts: DiscountsService;
  public readonly checkoutLinks: CheckoutLinksService;
  public readonly customers: CustomersService;
  public readonly collections: CollectionsService;
  public readonly checkout: CheckoutService;
  public readonly subscriptions: SubscriptionsService;
  public readonly addons: AddonsService;
  public readonly meters: MetersService;
  public readonly balances: BalancesService;
  public readonly digitalFiles: DigitalFilesService;
  public readonly developer: DeveloperService;
  public readonly disputes: DisputesService;
  public readonly refunds: RefundsService;
  public readonly orders: OrdersService;
  public readonly brands: BrandsService;
  public readonly refundRequests: RefundRequestsService;

  constructor(config: SolifynConfig) {
    if (!config || !config.apiKey) {
      throw new Error('Solifyn API key is required');
    }

    const { apiKey, baseURL } = config;

    this.products = new ProductsService(apiKey, baseURL);
    this.licenses = new LicensesService(apiKey, baseURL);
    this.discounts = new DiscountsService(apiKey, baseURL);
    this.checkoutLinks = new CheckoutLinksService(apiKey, baseURL);
    this.customers = new CustomersService(apiKey, baseURL);
    this.collections = new CollectionsService(apiKey, baseURL);
    this.checkout = new CheckoutService(apiKey, baseURL);
    this.subscriptions = new SubscriptionsService(apiKey, baseURL);
    this.addons = new AddonsService(apiKey, baseURL);
    this.meters = new MetersService(apiKey, baseURL);
    this.balances = new BalancesService(apiKey, baseURL);
    this.digitalFiles = new DigitalFilesService(apiKey, baseURL);
    this.developer = new DeveloperService(apiKey, baseURL);
    this.disputes = new DisputesService(apiKey, baseURL);
    this.refunds = new RefundsService(apiKey, baseURL);
    this.orders = new OrdersService(apiKey, baseURL);
    this.brands = new BrandsService(apiKey, baseURL);
    this.refundRequests = new RefundRequestsService(apiKey, baseURL);
  }
}
