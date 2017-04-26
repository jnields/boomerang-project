import { Router } from 'express';
import cd from '../catch-decorator';
import del from './delete';
import get from './get';
import patch from './patch';
import post from './post';
import query from './query';

const router = Router();

router.route('/')
  .get(cd(query))
  .post(cd(post));
router.route('/:id')
  .delete(cd(del))
  .get(cd(get))
  .patch(cd(patch));

export default router;
