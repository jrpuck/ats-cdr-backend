/**
 * @swagger
 * tags:
 *   name: CDRs
 *   description: Call Detail Records operations
 */
import { Router } from 'express';
import {
  getDetails,
  getSummary,
  getActivityLogs,
} from '../controllers/cdrController';
import { DETAILS_URI, SUMMARY_URI, LOGS_URI } from '../constants';

const router = Router();

/**
 * @openapi
 * /details:
 *   get:
 *     summary: Retrieve all CDR records for a customer
 *     parameters:
 *       - in: query
 *         name: cust_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID to filter by
 *     responses:
 *       '200':
 *         description: Array of CDR records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cdr'
 *       '400':
 *         description: cust_id must be a number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: cust_id must be a number
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get(DETAILS_URI, getDetails);

/**
 * @openapi
 * /summary:
 *   get:
 *     summary: Get daily summary counts of CDRs for a customer
 *     parameters:
 *       - in: query
 *         name: cust_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID to filter by
 *     responses:
 *       '200':
 *         description: Daily counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   day:
 *                     type: string
 *                     format: date
 *                   count:
 *                     type: integer
 *       '400':
 *         description: cust_id must be a number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: cust_id must be a number
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get(SUMMARY_URI, getSummary);

/**
 * @openapi
 * /logs:
 *   get:
 *     summary: Fetch paginated activity logs
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (must be ≥ 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of logs per page (must be ≥ 1)
 *     responses:
 *       '200':
 *         description: Paginated logs response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Total number of log entries
 *                 page:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *                 logs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Log'
 *       '400':
 *         description: Invalid pagination parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: page must be a positive integer
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal Server Error
 *
 * components:
 *   schemas:
 *     Cdr:
 *       type: object
 *       properties:
 *         cust_id:
 *           type: integer
 *         id:
 *           type: string
 *         seq:
 *           type: integer
 *         added_dt:
 *           type: string
 *           format: date-time
 *         start_time:
 *           type: string
 *           format: date-time
 *         end_time:
 *           type: string
 *           format: date-time
 *         caller_id:
 *           type: string
 *           nullable: true
 *
 *     Log:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         level:
 *           type: string
 *         message:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 */
router.get(LOGS_URI, getActivityLogs);

export default router;
