import { AppDataSource } from '../config/ormconfig';
import { DataSource } from 'typeorm';
import { BlogService } from '../service/blog.service';
import { InvoiceService } from '../service/invoice.service';
import { PAYMENT_METHOD } from '../constant/enum';
let invoiceService: InvoiceService;
let connection: DataSource;
beforeAll(async () => {
  connection = await AppDataSource.initialize();
  invoiceService = new InvoiceService();
});

afterAll(async () => {
  await connection.destroy();
});

describe('payment', () => {
  it('should return invoice', async () => {
    const params = {
      user_id: 59,
      name: 'Tinn',
      address: 'HCM',
      phone: '1234',
      email: '1234',
      total: 1000200,
      isOnline: true,
      note: 'Please',
      payment_method: PAYMENT_METHOD.COD,
    };
    const result = await invoiceService.payment(params);
    expect(result).not.toBeNull();
  });

  it('should return null when user_id is invalid', async () => {
    const params = {
      user_id: -1,
      name: 'Tin',
      address: 'HCM',
      phone: '123',
      email: '123',
      total: 100000,
      isOnline: true,
      note: 'Please',
      payment_method: PAYMENT_METHOD.COD,
    };
    const result = await invoiceService.payment(params);
    expect(result).toBeNull();
  });
});

describe('getOrder', () => {
  it('should return invoice when id exist', async () => {
    const id = 1;
    const result = await invoiceService.getOrder(id);
    expect(result).not.toBeNull();
  });

  it('should return null when id not exist', async () => {
    const id = -1;
    const result = await invoiceService.getOrder(id);
    expect(result).toBeNull();
  });
});

describe('getInvoiceDetailByInvoice', () => {
  it('should return invoiceDetail when id exist', async () => {
    const id = 18;
    const result = await invoiceService.getInvoiceDetailByInvoice(id);
    expect(result).not.toBeNull();
  });

  it('should return null when id not exist', async () => {
    const id = -1;
    const result = await invoiceService.getInvoiceDetailByInvoice(id);
    expect(result?.invoice).toBeNull();
  });
});

describe('updateStatusOrder', () => {
  it('should update status order when id exist and status is pending', async () => {
    const result = await invoiceService.updateStatusOrder(26, true);
    expect(result).toBeTruthy();
  });

  it('should update status order when id exist and status is shipping', async () => {
    const result = await invoiceService.updateStatusOrder(29, true);
    expect(result).toBeTruthy();
  });
  it('should update status order when id exist and cancel order', async () => {
    const result = await invoiceService.updateStatusOrder(33, false);
    expect(result).toBeTruthy();
  });

  it('should return false when id not exist', async () => {
    const result = await invoiceService.updateStatusOrder(-1, true);
    expect(result).toBeFalsy();
  });
});

describe('getOrders', () => {
  it('should return invoice when id exist', async () => {
    const params = {
      page: 1,
      limit: 10,
    };
    const result = await invoiceService.getOrders(params);
    expect(result).not.toBeNull();
  });

  it('should return null when page is invalid', async () => {
    const params = {
      page: -1,
      limit: 10,
    };
    const result = await invoiceService.getOrders(params);
    expect(result.length).toBe(0);
  });
});

describe('statisticRevenue', () => {
  it('should return revenue with full params', async () => {
    const result = await invoiceService.statisticRevenue();
    expect(result).not.toBeNull();
  });
});

describe('getStatistic', () => {
  it('should return statistic with year and startdate', async () => {
    const params = {
      year: 2020,
      startDate: new Date(2024, 1, 1),
    };
    const result = await invoiceService.getStatistic(params);
    expect(result).not.toBeNull();
  });

  it('should return statistic with year and enddate', async () => {
    const params = {
      year: 2020,
      endDate: new Date(2024, 1, 1),
    };
    const result = await invoiceService.getStatistic(params);
    expect(result).not.toBeNull();
  });

  it('should return statistic with params year and type', async () => {
    const params = {
      type: 'month',
      year: 2024,
    };
    const result = await invoiceService.getStatistic(params);
    expect(result).not.toBeNull();
  });

  it('should return statistic with year and startdate', async () => {
    const params = {
      year: 2024,
      startDate: new Date(2024, 10, 10),
      endDate: new Date(2024, 4, 4),
    };
    const result = await invoiceService.getStatistic(params);
    expect(result).not.toBeNull();
  });

  it('should return null when year is invalid', async () => {
    const params = {
      year: -1,
      startDate: new Date(2024, 1, 1),
      endDate: new Date(2024, 10, 10),
    };
    const result = await invoiceService.getStatistic(params);
    expect(result?.totalRevenue).toBeNull();
  });
  it('should return null when type is invalid', async () => {
    const params = {
      year: 2020,
      type: 'test',
    };
    const result = await invoiceService.getStatistic(params);
    expect(result?.totalRevenue).toBeNull();
  });
});

describe('getListYear', () => {
  it('should return list year', async () => {
    const result = await invoiceService.getListYear();
    expect(result).not.toBeNull();
  });
});
