import { Router } from 'express';
import eh from '../catch-decorator';
import del from './delete';
import gets from './get';
import patch from './patch';
import post from './post';
import query from './query';

const router = Router();

router.route('/')
  .get(eh(query))
  .post(eh(post));
router.route('/:id')
  .delete(eh(del))
  .get(eh(gets))
  .patch(eh(patch));

export default router;
