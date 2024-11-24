import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  const { projectId, description, unitPrice, quantity } = req.body;

  // Validation des données
  if (!projectId || !description || !unitPrice || !quantity) {
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
    // Calculer le total
    const total = unitPrice * quantity;

    // Création de la dépense
    const expense = await prisma.expense.create({
      data: {
        projectId: parseInt(projectId, 10), // S'assurer que projectId est un entier
        description: description.trim(),
        unitPrice: parseFloat(unitPrice.toFixed(2)), // Gérer le format des nombres
        quantity, // Utilisez directement quantity car c'est déjà un nombre
        total: parseFloat(total.toFixed(2)),
      },
    });

    return res.status(201).json({
      message: "Dépense créée avec succès.",
      expense,
    });
  } catch (error: any) {
    console.error("Erreur lors de la création de la dépense :", error);

    if (error.code === "P2003") {
      // Erreur de clé étrangère (projet non existant)
      return res.status(400).json({
        error: "Le projet spécifié n'existe pas.",
      });
    }

    return res.status(500).json({
      error: "Erreur interne du serveur.",
    });
  }
}
