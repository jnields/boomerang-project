import { Router } from 'express';
import api from './api';
import render from './server-rendering';

export default new Router()
  .use('/api', api)
  .use('/', render);
