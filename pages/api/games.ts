// pages/api/games.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { date, participants } = req.body;

    if (!date || !participants || participants.length < 2) {
      return res.status(400).json({ error: 'Date et participants requis (min. 2 participants)' });
    }

    try {
      const newGame = await prisma.game.create({
        data: {
          date: new Date(date),
          results: {
            create: participants.map((p: { userId: number; position: number }) => ({
              userId: p.userId,
              position: p.position,
            })),
          },
        },
      });

      return res.status(201).json(newGame);
    } catch (error) {
      console.error('Erreur lors de la création de la partie:', error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  } else {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
