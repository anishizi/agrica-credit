// pages/api/leaderboard.ts

import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Récupérer toutes les parties et leurs résultats
      const results = await prisma.gameResult.findMany({
        include: { user: { select: { id: true, username: true } } },
      });

      // Calcul des statistiques
      const stats: Record<number, { username: string; gamesPlayed: number; gamesWon: number }> =
        {};

      results.forEach((result) => {
        const userId = result.userId;
        if (!stats[userId]) {
          stats[userId] = {
            username: result.user.username,
            gamesPlayed: 0,
            gamesWon: 0,
          };
        }

        stats[userId].gamesPlayed += 1;
        if (result.position === 1) {
          stats[userId].gamesWon += 1;
        }
      });

      // Transformer en tableau et calculer les ratios
      const leaderboard = Object.values(stats).map((stat) => ({
        ...stat,
        winRatio: stat.gamesPlayed > 0 ? stat.gamesWon / stat.gamesPlayed : 0,
      }));

      // Trier par ratio de victoires décroissant
      leaderboard.sort((a, b) => b.winRatio - a.winRatio);

      return res.status(200).json(leaderboard);
    } catch (error) {
      console.error('Erreur lors de la récupération du classement:', error);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  } else {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }
}
