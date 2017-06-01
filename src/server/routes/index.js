import { Router } from 'express';
import api from './api';
import render from './no-server-rendering';

export default new Router()
  .use('/api', api)
  .use('/', render);
