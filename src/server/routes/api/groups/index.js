import { Router } from 'express';
import cd from '../catch-decorator';
import del from './delete';
import patch from './patch';
import post from './post';
import query from './query';
import gett from './get';

const router = Router();

router.route('/')
  .get(cd(query))
  .post(cd(post))
  .delete(cd(del));

router.route('/:id')
  .delete(cd(del))
  .get(cd(gett))
  .patch(cd(patch));

export default router;
