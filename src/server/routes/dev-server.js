import { Router } from 'express';
import api from './api';
import render from './no-server-rendering';

const router = new Router();
router.use('/api', api);
router.use('/', render);

export default router;
