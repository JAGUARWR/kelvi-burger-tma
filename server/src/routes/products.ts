import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

router.get('/', async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' },
  });
  res.json(products);
});

export default router;
