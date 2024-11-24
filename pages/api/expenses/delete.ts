import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "L'ID de la dépense est obligatoire." });
  }

  try {
    // Supprimer la dépense
    await prisma.expense.delete({
      where: { id: parseInt(id, 10) },
    });

    return res.status(200).json({ message: "Dépense supprimée avec succès." });
  } catch (error: any) {
    console.error("Erreur lors de la suppression de la dépense :", error);

    return res.status(500).json({
      error: "Erreur interne du serveur.",
    });
  }
}
