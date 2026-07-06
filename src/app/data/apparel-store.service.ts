import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

// import {
//   addProductToSnapshot,
//   createInitialSnapshot,
//   recordPurchaseInSnapshot,
//   recordSaleInSnapshot,
//   restockProductInSnapshot,
// } from './apparel-domain';
import { BACKEND_SYNC_ENABLED } from './backend-sync.token';
import {
  ApparelSnapshot,
  CategoryBreakdown,
  ChannelBreakdown,
  DetailedReportData,
  NewProductInput,
  NewPurchaseInput,
  NewSaleInput,
  Product,
  PurchaseOrder,
  SaleOrder,
} from './apparel.models';
import { HttpService } from './http-service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { startupSnapshot } from 'node:v8';
type NotificationCallback = (v: any) => void;
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

@Injectable({ providedIn: 'root' })
export class ApparelStoreService {
  private readonly backendSyncEnabled = inject(BACKEND_SYNC_ENABLED);
  private http = inject(HttpService);
  // private readonly state = signal<ApparelSnapshot>(createInitialSnapshot());
  private readonly state = signal<{
    products: any[];
    purchases: any[];
    sales: any[];
    detailedReportData: { start: string; end: string; data: DetailedReportData[] };
    // snapshot: any;
  }>({
    products: [],
    purchases: [],
    sales: [],
    detailedReportData: { start: '', end: '', data: [] },
    // snapshot: {},
  });

  Notification = signal<{ fetch_status: 'success' | 'error' | 'rested'; loading: boolean }>({
    fetch_status: 'rested',
    loading: false,
  });
  constructor() {
    if (this.backendSyncEnabled) {
      void this.refreshFromBackend();
    }
  }

  readonly products = computed(() => this.state().products);
  readonly purchases = computed(() => this.state().purchases);
  readonly sales = computed(() => this.state().sales);
  readonly detailedReportData = computed(() => this.state().detailedReportData);
  readonly revenue = computed(() => this.sales().reduce((total, sale) => total + sale.total, 0));

  readonly purchaseSpend = computed(() =>
    this.purchases().reduce((total, purchase) => total + purchase.total, 0),
  );

  readonly inventoryValue = computed(() =>
    this.products().reduce((total, product) => total + product.stock * product.cost, 0),
  );

  readonly totalUnits = computed(() =>
    this.products().reduce((total, product) => total + product.stock, 0),
  );
  getInitialDates() {
    const end = new Date().toISOString();
    const start = new Date();
    start.setDate(start.getDate() - 6);
    this.setReportDates(start.toISOString(), end);
    // this.state.update((state) => ({
    //   ...state,
    //   detailedReportData: { ...state.detailedReportData, start: start.toISOString(), end: end },
    // }));
  }
  setReportDates(start: string, end: string) {
    this.state.update((state) => ({
      ...state,
      detailedReportData: {
        ...state.detailedReportData,
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
      },
    }));
  }
  getInitialReportData() {
    this.getInitialDates();
    const { start, end } = this.state().detailedReportData;
    this.getDetailedReportData(start, end);
  }

  readonly lowStockProducts = computed(() =>
    [...this.products()]
      .filter((product) => product.stock <= product.reorderPoint)
      .sort((left, right) => left.stock - right.stock),
  );

  readonly categoryBreakdown = computed<CategoryBreakdown[]>(() => {
    const grouped = new Map<string, number>();

    for (const product of this.products()) {
      grouped.set(product.category, (grouped.get(product.category) ?? 0) + product.stock);
    }

    const totalUnits = Math.max(
      1,
      Array.from(grouped.values()).reduce((total, amount) => total + amount, 0),
    );

    return Array.from(grouped.entries())
      .map(([category, units]) => ({
        category,
        units,
        share: Math.round((units / totalUnits) * 100),
      }))
      .sort((left, right) => right.units - left.units);
  });

  readonly channelBreakdown = computed<ChannelBreakdown[]>(() => {
    const grouped = new Map<ChannelBreakdown['channel'], number>();

    for (const sale of this.sales()) {
      grouped.set(sale.channel, (grouped.get(sale.channel) ?? 0) + sale.total);
    }

    const totalRevenue = Math.max(
      1,
      Array.from(grouped.values()).reduce((total, amount) => total + amount, 0),
    );

    return Array.from(grouped.entries())
      .map(([channel, total]) => ({
        channel,
        total,
        share: Math.round((total / totalRevenue) * 100),
      }))
      .sort((left, right) => right.total - left.total);
  });

  readonly estimatedMargin = computed(() => {
    const costLookup = new Map(this.products().map((product) => [product.name, product.cost]));
    const soldCost = this.sales().reduce((total, sale) => {
      const costPerUnit = costLookup.get(sale.item) ?? 0;
      return total + costPerUnit * sale.units;
    }, 0);

    return this.revenue() - soldCost;
  });

  readonly sellThroughRate = computed(() => {
    const stock = this.totalUnits();
    const soldUnits = this.sales().reduce((total, sale) => total + sale.units, 0);

    return soldUnits / Math.max(stock + soldUnits, 1);
  });

  readonly recentPurchases = computed(() => [...this.purchases()].reverse().slice(0, 4));
  readonly recentSales = computed(() => [...this.sales()].reverse().slice(0, 4));

  addProduct<T>(input: NewProductInput) {
    this.showLoad();
    this.http
      .post('/api/products', input)
      .then((res) => {
        this.state.update((state) => {
          return {
            ...state,
            products: [...state.products, res],
          };
        });
        this.resetNotification();
      })
      .catch((err) => {
        this.showError();
        this.retry = () => {
          this.addProduct(input);
        };
      });
  }

  restockProduct(productId: string, units: number, orderedOn = this.today()): void {
    this.showLoad();
    this.http
      .put(`/api/products/${productId}/restock`, { units })
      .then((res) => {
        this.state.update((state) => {
          return {
            ...state,
            products: state.products.map((product) => {
              return product._id == productId ? res : product;
            }),
          };
        });
        this.resetNotification();
      })

      .catch((err) => {
        console.log(err.message);
        this.showError();
        this.retry = () => {
          this.restockProduct(productId, units);
        };
      });
  }

  recordSale(input: Partial<SaleOrder>) {
    this.showLoad();
    this.http
      .post('/api/sales', input)
      .then((res: any) => {
        this.state.update((state) => {
          return {
            ...state,
            sales: [...state.sales, res],
            products: state.products.map((product) => {
              return product._id == input.item
                ? { ...product, stock: product.stock - res.units }
                : product;
            }),
          };
        });
        this.resetNotification();
      })
      .catch((err) => {
        console.log(err.message);
        this.showError();
        this.retry = () => {
          this.recordSale(input);
        };
      });
  }
  recordPurchase(input: PurchaseOrder): void {
    this.showLoad();
    this.http
      .post('/api/purchases', input)
      .then((res: any) => {
        this.state.update((state) => {
          return {
            ...state,
            purchases: [...state.purchases, res],
            products: state.products.map((product) => {
              return product._id == input.item
                ? { ...product, stock: product.stock + res.units }
                : product;
            }),
          };
        });
        this.resetNotification();
      })
      .catch((err) => {
        console.log(err.message);
        this.showError();
        this.retry = () => {
          this.recordPurchase(input);
        };
      });
  }
  getDetailedReportData(start: string, end = new Date().toISOString()): void {
    this.showLoad();
    this.http
      .get(`/api/detailed-report?start=${start}&end=${end}`)
      .then((res: any) => {
        this.state.update((state) => {
          return {
            ...state,
            detailedReportData: { ...state.detailedReportData, data: res },
          };
        });
        this.resetNotification();
      })
      .catch((err) => {
        console.log(err.message);
        this.showError();
        this.retry = () => {
          this.getDetailedReportData(start, end);
        };
      });
  }

  productOptions(): Product[] {
    return this.products();
  }

  getProduct(productId: string): Product | undefined {
    return this.products().find((entry) => entry._id === productId);
  }
  patchProductState(id: string) {}

  refreshFromBackend(): void {
    this.http
      .get('/api/refresh')
      .then((response: any) => {
        this.state.set({
          ...response,
          detailedReportData: { ...this.state().detailedReportData, data: [] },
        });
      })
      .catch((error) => {
        console.warn('Unable to fetch apparel snapshot from backend.', error);
      });
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
  testHttp() {
    // code for testing or simulating backend async call
    this.Notification.update((state) => ({ ...state, loading: true }));
    setTimeout(() => {
      this.Notification.update((state) => ({ ...state, loading: false }));
    }, 5000);
  }
  resetNotification() {
    this.Notification.set({ loading: false, fetch_status: 'rested' });
  }
  showError() {
    this.Notification.update((state) => ({ ...state, fetch_status: 'error' }));
  }
  showLoad(message = 'loading....') {
    this.Notification.update((state) => ({ ...state, loading: true }));
  }
  stopLoad(message = 'loading....') {
    this.Notification.update((state) => ({ ...state, loading: false }));
  }
  formatMoney(value: number) {
    return formatCurrency(value);
  }
  retry: any = () => console.log('done');
}
