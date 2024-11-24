// pages/api/games/list.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany({
        include: {
          results: {
            include: {
              user: { select: { id: true, username: true } },
            },
          },
        },
      });

      return res.status(200).json(games);
    } catch (error) {
      console.error('Erreur lors de la récupération des parties:', error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  } else {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
