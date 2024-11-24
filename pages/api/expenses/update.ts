import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { id, description, unitPrice, quantity } = req.body;

  // Validation des données
  if (!id || !description || !unitPrice || !quantity) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  if (typeof description !== "string" || description.trim().length === 0 || description.trim().length > 50) {
    return res.status(400).json({
      error: "La description est obligatoire et doit contenir au maximum 50 caractères.",
    });
  }

  if (typeof unitPrice !== "number" || unitPrice <= 0) {
    return res.status(400).json({
      error: "Le prix unitaire doit être un nombre valide supérieur à 0.",
    });
  }

  if (typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({
      error: "La quantité doit être un nombre valide supérieur à 0.",
    });
  }

  try {
    // Calculer le nouveau total
    const total = unitPrice * quantity;

    // Mise à jour de la dépense
    const updatedExpense = await prisma.expense.update({
      where: { id: typeof id === "string" ? parseInt(id, 10) : id }, // Identifier la dépense par son ID
      data: {
        description: description.trim(),
        unitPrice: parseFloat(unitPrice.toFixed(2)),
        quantity, // Utilisez directement quantity
        total: parseFloat(total.toFixed(2)),
      },
    });

    return res.status(200).json({
      message: "Dépense mise à jour avec succès.",
      expense: updatedExpense,
    });
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de la dépense :", error);

    return res.status(500).json({
      error: "Erreur interne du serveur.",
    });
  }
}
