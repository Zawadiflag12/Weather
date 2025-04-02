import path from 'node:path';
import { fileURLToPath } from 'url';
import { Router } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get('/', (_, res) => {
  res.sendFile(path.resolve(__dirname, '../../../client/dist/index.html'));
});



export default router;
