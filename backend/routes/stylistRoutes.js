import express from 'express';
import {
  getStylists,
  addStylist,
  deleteStylist,
  reactivateStylist,
  markAttendance,
  toggleBreak
} from '../controllers/stylistController.js';

const router = express.Router();

router.get('/', getStylists);
router.post('/add', addStylist);
router.delete('/delete/:id', deleteStylist);
router.patch('/reactivate/:id', reactivateStylist);
router.patch('/attendance/:id', markAttendance);
router.patch('/break/:id', toggleBreak);

export default router;
