import { Router } from 'express';
import del from './delete';
import gets from './get';
import patch from './patch';
import post from './post';
import query from './query';
import eh from '../catch-decorator';

const router = Router();

router.route('/')
  .get(eh(query))
  .post(eh(post))
  .patch(eh(patch));

router.route('/:id')
  .delete(eh(del))
  .get(eh(gets))
  .patch(eh(patch));

export default router;
