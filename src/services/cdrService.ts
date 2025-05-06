import { prisma } from '../utils/prisma';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants';

export default class CdrService {
  /**
   * Fetch raw CDR details for a customer.
   */
  static async getDetails(custId: number) {
    return prisma.cdr.findMany({ where: { cust_id: custId } });
  }

  /**
   * Return daily counts via raw SQL (tagged template).
   */
  static async getSummary(custId: number) {
    const all = await prisma.cdr.findMany({
      where: { cust_id: custId },
      select: { start_time: true }
    });
  
    const counts = all.reduce<Record<string, number>>((acc, { start_time }) => {
      const day = start_time.toISOString().slice(0, 10);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(counts)
      .map(([day, count]) => ({ day: new Date(day), count }))
      .sort((a, b) => a.day.getTime() - b.day.getTime());
  }

  /**
   * Fetch paginated activity logs.
   * @returns an object with `total`, `page`, `pageSize`, `logs[]`.
   */
  static async getActivityLogs(
    page: number = DEFAULT_PAGE,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ) {
    // run both count & findMany in parallel
    const [total, logs] = await Promise.all([
      prisma.log.count(),
      prisma.log.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return { total, page, pageSize, logs };
  }
}
