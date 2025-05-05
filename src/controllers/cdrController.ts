import { RequestHandler } from 'express';
import CdrService from '../services/cdrService';
import { logger } from '../utils/logger';
import {
  QUERY_PARAM_PAGE,
  QUERY_PARAM_PAGE_SIZE,
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  ERR_PAGE_INVALID,
  ERR_PAGE_SIZE_INVALID,
  ERR_INTERNAL_SERVER,
  ERR_CUST_ID_INVALID,
} from '../constants';

/**
 * GET /details?cust_id=X
 */
export const getDetails: RequestHandler = async (req, res) => {
  try {
    const custId = Number(req.query.cust_id);
    if (isNaN(custId)) {
      res.status(400).json({ error: ERR_CUST_ID_INVALID });
      return;
    }
    const details = await CdrService.getDetails(custId);
    res.json(details);
  } catch (err: unknown) {
    logger.error('Failed to fetch CDR details', err);
    res.status(500).json({ error: ERR_INTERNAL_SERVER });
  }
};

/**
 * GET /summary?cust_id=X
 */
export const getSummary: RequestHandler = async (req, res) => {
  try {
    const custId = Number(req.query.cust_id);
    if (isNaN(custId)) {
      res.status(400).json({ error: ERR_CUST_ID_INVALID });
      return;
    }
    const summary = await CdrService.getSummary(custId);
    res.json(summary);
  } catch (err: unknown) {
    logger.error('Failed to fetch CDR summary', err);
    res.status(500).json({ error: ERR_INTERNAL_SERVER });
  }
};

/**
 * GET /logs?page=X&page_size=Y
 */
export const getActivityLogs: RequestHandler = async (req, res) => {
  try {
    const rawPage = req.query[QUERY_PARAM_PAGE] as string | undefined;
    const rawPageSize = req.query[QUERY_PARAM_PAGE_SIZE] as string | undefined;

    const page = rawPage ? parseInt(rawPage, 10) : DEFAULT_PAGE;
    const pageSize = rawPageSize
      ? parseInt(rawPageSize, 10)
      : DEFAULT_PAGE_SIZE;

    if (rawPage && (isNaN(page) || page < 1)) {
      res.status(400).json({ error: ERR_PAGE_INVALID });
      return;
    }
    if (rawPageSize && (isNaN(pageSize) || pageSize < 1)) {
      res.status(400).json({ error: ERR_PAGE_SIZE_INVALID });
      return;
    }

    const result = await CdrService.getActivityLogs(page, pageSize);
    res.json(result);
  } catch (err: unknown) {
    logger.error('Failed to fetch activity logs', err);
    res.status(500).json({ error: ERR_INTERNAL_SERVER });
  }
};
