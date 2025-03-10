import path from 'node:path';
import { Router } from 'express';

const router = Router();


router.get('/', (_, res) => {
  res.sendFile(path.resolve('client/public/src/index.html'));
});


export default router;
