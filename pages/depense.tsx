import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaPlus } from "react-icons/fa";
import ExpenseCreationPopup from "../components/ExpenseCreationPopup";
import NotificationPopup from "../components/NotificationPopup";

interface Project {
  id: number;
  projectName: string;
}

interface Expense {
  id: number;
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
  createdAt: string;
}

const DepensePage: React.FC = () => {
  const router = useRouter(); // Pour récupérer le projectId de l'URL
  const [showPopup, setShowPopup] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);

  // Charger les projets
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/project/getProjects");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          setNotification({
            message: "Erreur lors de la récupération des projets.",
            type: "error",
          });
        }
      } catch (error) {
        setNotification({
          message: "Erreur réseau lors de la récupération des projets.",
          type: "error",
        });
      }
    };

    fetchProjects();
  }, []);

  // Charger le projectId depuis l'URL
  useEffect(() => {
    if (router.query.projectId) {
      setSelectedProjectId(Number(router.query.projectId));
    }
  }, [router.query]);

  // Charger les dépenses pour le projet sélectionné
  useEffect(() => {
    if (selectedProjectId) {
      const fetchExpenses = async () => {
        setLoadingExpenses(true);
        try {
          const response = await fetch(
            `/api/expenses/getByProject?projectId=${selectedProjectId}`
          );
          if (response.ok) {
            const data = await response.json();
            setExpenses(data);
          } else {
            setExpenses([]);
          }
        } catch (error) {
          setNotification({
            message: "Erreur réseau lors de la récupération des dépenses.",
            type: "error",
          });
        } finally {
          setLoadingExpenses(false);
        }
      };

      fetchExpenses();
    }
  }, [selectedProjectId]);

  // Calculer le total des dépenses
  const totalDepenses = expenses.reduce((sum, expense) => sum + expense.total, 0);

  // Formater les montants avec un espace pour les milliers
  const formatCurrency = (amount: number): string =>
    Math.floor(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  const handleExpenseSubmit = async (expenseData: any) => {
    try {
      const response = await fetch("/api/expenses/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const result = await response.json();
        setNotification({
          message: "Dépense créée avec succès.",
          type: "success",
        });

        // Recharger les dépenses après ajout
        if (selectedProjectId) {
          const projectId = selectedProjectId;
          setSelectedProjectId(null);
          setTimeout(() => setSelectedProjectId(projectId), 500);
        }
      } else {
        const errorData = await response.json();
        setNotification({
          message: `Erreur : ${errorData.error}`,
          type: "error",
        });
      }
    } catch (error) {
      setNotification({
        message: "Erreur réseau lors de la création de la dépense.",
        type: "error",
      });
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Bouton flottant pour ajouter une dépense */}
      <div className="fixed top-2 right-2 z-50">
        <button
          className="bg-blue-500 text-white rounded-full p-2 shadow-lg"
          onClick={() => setShowPopup(true)}
        >
          <FaPlus size={20} />
        </button>
      </div>

      {/* Liste déroulante pour sélectionner un projet */}
      {projects.length > 0 && (
        <div className="mb-4">
          <label htmlFor="project-select" className="block mb-2 text-gray-700">
            Sélectionnez un projet :
          </label>
          <select
            id="project-select"
            className="w-full border rounded p-2"
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            value={selectedProjectId ?? ""}
          >
            <option value="">-- Sélectionnez un projet --</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Liste des dépenses */}
      {selectedProjectId && (
        <div>
          {loadingExpenses ? (
            <p>Chargement des dépenses...</p>
          ) : expenses.length > 0 ? (
            <table className="table-auto w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border border-gray-200 px-4 py-2">Description</th>
                  <th className="border border-gray-200 px-4 py-2">PU</th>
                  <th className="border border-gray-200 px-4 py-2">Qt</th>
                  <th className="border border-gray-200 px-4 py-2">Total (TND)</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td className="border border-gray-200 px-4 py-2">{expense.description}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {formatCurrency(expense.unitPrice)}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">{expense.quantity}</td>
                    <td className="border border-gray-200 px-4 py-2">
                      {formatCurrency(expense.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Ce projet n'a pas de dépense.</p>
          )}

          {/* Total des dépenses */}
          {expenses.length > 0 && (
            <div className="mt-4 p-2 bg-gray-100 rounded-lg shadow flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Total Dépenses :</h2>
              <p className="text-2xl font-bold text-gray-500">
                {formatCurrency(totalDepenses)} TND
              </p>
            </div>
          )}
        </div>
      )}

      {/* Popup pour créer une dépense */}
      {showPopup && (
        <ExpenseCreationPopup
          onClose={() => setShowPopup(false)}
          onSubmit={handleExpenseSubmit}
        />
      )}

      {/* Notification Popup */}
      {notification.type && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: null })}
        />
      )}
    </div>
  );
};

export default DepensePage;
