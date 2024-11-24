import React, { useState, useEffect } from 'react';
import GameCreationPopup from '../components/GameCreationPopup';
import NotificationPopup from '../components/NotificationPopup';
import { FaPlus } from 'react-icons/fa';

interface PlayerStats {
  id: number;
  username: string;
  gamesPlayed: number;
  gamesWon: number;
  winRatio: number;
}

interface Game {
  id: number;
  date: string;
  createdAt: string; // Ajout de la propriété manquante
  results: {
    position: number;
    user: { id: number; username: string };
  }[];
}


interface User {
  id: number;
  username: string;
}

const Home: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<PlayerStats[]>([]); // Classement
  const [games, setGames] = useState<Game[]>([]); // Historique des parties
  const [participants, setParticipants] = useState<User[]>([]); // Liste de tous les utilisateurs
  const [showGamePopup, setShowGamePopup] = useState(false); // Popup pour ajouter une partie
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showTable, setShowTable] = useState(false); // Affichage de l'historique paginé
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const itemsPerPage = 5; // Nombre d'éléments par page

  // Charger les données initiales
  useEffect(() => {
    fetchLeaderboard();
    fetchGames();
    fetchParticipants();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/leaderboard');
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data);
      } else {
        throw new Error('Impossible de charger le classement.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ message: error.message, type: 'error' });
      } else {
        setNotification({ message: 'Une erreur inconnue est survenue lors du chargement du classement.', type: 'error' });
      }
    }
  };

  const fetchGames = async () => {
    try {
      const response = await fetch('/api/games/list');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      } else {
        throw new Error('Impossible de charger l\'historique des parties.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ message: error.message, type: 'error' });
      } else {
        setNotification({ message: 'Une erreur inconnue est survenue lors du chargement des parties.', type: 'error' });
      }
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch('/api/participants');
      if (response.ok) {
        const data = await response.json();
        setParticipants(data);
      } else {
        throw new Error('Impossible de charger la liste des participants.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ message: error.message, type: 'error' });
      } else {
        setNotification({ message: 'Une erreur inconnue est survenue lors du chargement des participants.', type: 'error' });
      }
    }
  };

  const handleGameSubmit = async (gameData: any) => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameData),
      });
  
      if (response.ok) {
        setNotification({ message: 'Partie ajoutée avec succès.', type: 'success' });
        setShowGamePopup(false);
        fetchLeaderboard();
        fetchGames();
      } else {
        throw new Error('Erreur lors de l\'ajout de la partie.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setNotification({ message: error.message, type: 'error' });
      } else {
        setNotification({ message: 'Une erreur inconnue est survenue lors de l\'ajout de la partie.', type: 'error' });
      }
    }
  };

  const totalPages = Math.ceil(games.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  const currentItems = games.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-2 bg-gradient-to-b from-gray-900 via-gray-800 to-black min-h-screen text-white">
    <h1 className="text-2xl font-extrabold mb-2 text-center text-neon-blue">
      🕹️ Tableau de Classement
    </h1>
  
    {/* Section Classement Général */}
    <div className="mb-2">
     
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {leaderboard.map((player, index) => (
          <div
            key={player.id}
            className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-xl shadow-lg p-2 text-center border border-neon-blue"
          >
            <div className="text-4xl font-extrabold mb-2">
              {index + 1 === 1 ? (
                <span className="text-yellow-400">🥇</span>
              ) : index + 1 === 2 ? (
                <span className="text-gray-400">🥈</span>
              ) : index + 1 === 3 ? (
                <span className="text-orange-500">🥉</span>
              ) : (
                `${index + 1}e`
              )}
            </div>
            <h3 className="text-xl font-bold text-neon-green">{player.username}</h3>
            <p className="text-white text-l">Parties Jouées: {player.gamesPlayed} Parties Gagnées: {player.gamesWon}</p>
            
            <p className="text-neon-purple text-sm">
              Ratio de Victoire: {Math.round(player.winRatio * 100)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  
    {/* Section Historique des Parties */}
    <div className="mb-2">
    <button
          onClick={() => setShowTable(!showTable)}
          className="bg-gradient-to-b from-yellow-500 to-orange-600 text-white font-semibold px-6 py-3 rounded-md hover:from-yellow-600 hover:to-orange-700 shadow-lg hover:scale-105 transition-all duration-300 w-full border-2 border-yellow-600"

        >
          {showTable ? 'Masquer l\'historique' : 'Afficher l\'historique'}
        </button>

  
      {showTable && (
        <div className="mt-2">
          <h2 className="text-2xl font-bold mb-2 text-center text-neon-blue">
            Historique des Parties
          </h2>
          <div className="mt-4">
  {currentItems.length > 0 ? (
    <table className="table-auto w-full border-collapse border border-gray-700">
      <thead>
        <tr className="bg-gray-800 text-white">
          
          <th className="border border-gray-700 px-4 py-2 text-left">Date</th>
          <th className="border border-gray-700 px-4 py-2 text-left">Positions et Participant</th>
        </tr>
      </thead>
      <tbody>
        {currentItems.map((game) => (
          <tr key={game.id}>
           
            <td className="border border-gray-700 px-4 py-2 text-white">
  <span>{new Date(game.date).toLocaleDateString('fr-FR')}</span>
  <br />
  <span className="text-white text-sm">{new Date(game.createdAt).toLocaleTimeString('fr-FR')}</span>
</td>

            <td className="border border-gray-700 px-4 py-2 text-gray-300">
              {game.results
                .map(
                  (result) =>
                    `${result.position}e: ${result.user.username}`
                )
                .join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p className="text-center text-gray-500">Aucun historique disponible</p>
  )}
</div>

  
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`px-6 py-2 rounded-lg font-bold ${
                currentPage === 1
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-neon-green text-black hover:bg-neon-blue'
              }`}
            >
              &larr; Précédent
            </button>
            <span className="text-gray-400">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-6 py-2 rounded-lg font-bold ${
                currentPage === totalPages
                  ? 'bg-gray-600 text-gray-400'
                  : 'bg-neon-green text-black hover:bg-neon-blue'
              }`}
            >
              Suivant &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  
    <div className="fixed top-2 right-2 z-50">
  <button
    className="bg-blue-500 text-white rounded-full p-2 shadow-lg"
    onClick={() => setShowGamePopup(true)}
  >
    <FaPlus size={20} />
  </button>
</div>

    {/* Popup pour Ajouter une Partie */}
{showGamePopup && (
  <div className="isolate text-black">
    <GameCreationPopup
      participants={participants}
      onClose={() => setShowGamePopup(false)}
      onSubmit={handleGameSubmit}
    />
  </div>
)}

  
    {/* Notification Popup */}
    {notification && (
      <NotificationPopup
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(null)}
      />
    )}
  </div>
  
  );
};

export default Home;
