import express from 'express';
import { downloadDailyReport, downloadMonthlyReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/daily', downloadDailyReport);
router.get('/monthly', downloadMonthlyReport); // <-- ADD THIS

export default router;
