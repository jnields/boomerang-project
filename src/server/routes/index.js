import { Router } from 'express';
import api from './api';
import render from './server-rendering';
import reports from './reports';

const router = new Router();
router.use('/api', api);
router.use('/reports', reports);
router.use('/', render);

export default router;
