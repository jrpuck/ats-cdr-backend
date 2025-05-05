import axios from 'axios';
import { prisma } from '../src/utils/prisma';
import CdrService from '../src/services/cdrService';

jest.mock('axios');
jest.mock('../src/utils/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
    cdr: { findMany: jest.fn() },
    log: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('CdrService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.API_URL = 'https://api.atscall.me:1234';
  });

  it('getDetails()', async () => {
    (prisma.cdr.findMany as jest.Mock).mockResolvedValue([{ cust_id: 1 }]);
    const res = await CdrService.getDetails(1);
    expect(prisma.cdr.findMany).toHaveBeenCalledWith({ where: { cust_id: 1 } });
    expect(res).toEqual([{ cust_id: 1 }]);
  });

  it('getSummary()', async () => {
    const mock = [{ day: new Date('2025-05-01'), count: BigInt(5) }];
    (prisma.$queryRaw as jest.Mock).mockResolvedValue(mock);
    const res = await CdrService.getSummary(42);
    expect(res).toEqual([{ day: mock[0].day, count: 5 }]);
  });

  it('getActivityLogs()', async () => {
    const mockLogs = [
      { id: 2, level: 'warn', message: 'bar', createdAt: new Date() },
    ];
    (prisma.log.count as jest.Mock).mockResolvedValue(100);
    (prisma.log.findMany as jest.Mock).mockResolvedValue(mockLogs);

    const page = 2;
    const pageSize = 10;
    const result = await CdrService.getActivityLogs(page, pageSize);

    expect(prisma.log.findMany).toHaveBeenCalledWith({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual({
      total: 100,
      page,
      pageSize,
      logs: mockLogs,
    });
  });
});
