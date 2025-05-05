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
    const rows = await prisma.$queryRaw<{ day: Date; count: bigint }[]>`
      SELECT DATE(start_time) AS day, COUNT(*) AS count
      FROM cdrs
      WHERE cust_id = ${custId}
      GROUP BY day
      ORDER BY day ASC;
    `;
    return rows.map((r) => ({ day: r.day, count: Number(r.count) }));
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
