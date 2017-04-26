import { Router } from 'express';
import del from './delete';
import get from './get';
import patch from './patch';
import post from './post';
import query from './query';
import eh from '../catch-decorator';

const router = Router();

router.route('/')
  .get(eh(query))
  .post(eh(post));

router.route('/:id')
  .delete(eh(del))
  .get(eh(get))
  .patch(eh(patch));

export default router;
