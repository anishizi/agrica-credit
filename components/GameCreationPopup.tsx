import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  username: string;
}

interface GameCreationPopupProps {
  participants: User[]; // Ajoutez cette ligne
  onClose: () => void;
  onSubmit: (gameData: any) => void;
}


const GameCreationPopup: React.FC<GameCreationPopupProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1); // Étape actuelle
  const [date, setDate] = useState(''); // Date de la partie
  const [participants, setParticipants] = useState<User[]>([]); // Liste des participants disponibles
  const [selectedParticipants, setSelectedParticipants] = useState<
    { userId: number; position: number }[]
  >([]); // Participants sélectionnés avec leurs positions
  const [participantError, setParticipantError] = useState(false); // Erreur de sélection des participants
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  // Charger les participants depuis l'API
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participants');
        if (response.ok) {
          const data = await response.json();
          setParticipants(data);
        } else {
          throw new Error('Impossible de charger les participants.');
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Une erreur inconnue est survenue.';
        setNotification({ message: errorMessage, type: 'error' });
      }
    };
  
    fetchParticipants();
  }, []);
  
  // Gestion du bouton Suivant
  const handleNextStep = () => {
    if (step === 1) {
      if (!date) {
        setNotification({ message: 'Veuillez sélectionner une date.', type: 'error' });
        return;
      }
      setStep(step + 1);
    } else if (step === 2) {
      if (selectedParticipants.length < 2) {
        setParticipantError(true);
        setNotification({ message: 'Sélectionnez au moins deux participants.', type: 'error' });
      } else {
        setParticipantError(false);
        setStep(step + 1);
      }
    } else if (step === 3) {
      if (selectedParticipants.some((p) => p.position === 0)) {
        setParticipantError(true);
        setNotification({ message: 'Chaque participant doit avoir une position définie.', type: 'error' });
      } else {
        setParticipantError(false);
        setStep(step + 1);
      }
    } else {
      setStep(step + 1);
    }
  };

  // Gestion du bouton Précédent
  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  // Ajouter ou modifier un participant sélectionné
  const handleToggleParticipant = (userId: number) => {
    setSelectedParticipants((prev) =>
      prev.some((p) => p.userId === userId)
        ? prev.filter((p) => p.userId !== userId)
        : [...prev, { userId, position: 0 }]
    );
  };

  // Gestion de l'attribution de position
  const handleAssignPosition = (userId: number, position: number) => {
    setSelectedParticipants((prev) =>
      prev.map((p) =>
        p.userId === userId ? { ...p, position } : p
      )
    );
  };

  // Réinitialiser les positions
  const handleResetPositions = () => {
    setSelectedParticipants((prev) =>
      prev.map((p) => ({ ...p, position: 0 }))
    );
  };

  // Soumission des données
  const handleSubmit = () => {
    const gameData = {
      date,
      participants: selectedParticipants,
    };
    onSubmit(gameData);
    onClose();
  };

  const stepTitles = ['Date', 'Participants', 'Assignation', 'Confirmation'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          {stepTitles.map((title, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    step > index ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs mt-1">{title}</p>
              </div>
              {index < stepTitles.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    step > index + 1 ? 'bg-green-500' : 'bg-gray-300'
                  } mx-2`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Étape 1 : Date */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sélectionnez la Date</h2>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded p-2 mb-4"
            />
            <div className="flex justify-between">
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded" onClick={onClose}>
                Annuler
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleNextStep}>
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 2 : Participants */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Sélectionnez les Participants</h2>
            {participants.map((user) => (
              <div key={user.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={!!selectedParticipants.find((p) => p.userId === user.id)}
                  onChange={() => handleToggleParticipant(user.id)}
                />
                <label className="flex-grow">{user.username}</label>
              </div>
            ))}
            {participantError && (
              <p className="text-red-500 text-sm mt-2">{notification?.message || 'Erreur.'}</p>
            )}
            <div className="flex justify-between mt-4">
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded" onClick={handlePreviousStep}>
                Précédent
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleNextStep}>
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 3 : Assignation */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Assignation des Positions</h2>
            {selectedParticipants.map((p) => (
              <div key={p.userId} className="flex items-center mb-2">
                <label className="flex-grow">
                  {participants.find((user) => user.id === p.userId)?.username}
                </label>
                <select
                  value={p.position || ''}
                  onChange={(e) =>
                    handleAssignPosition(p.userId, parseInt(e.target.value, 10) || 0)
                  }
                  className="border rounded p-1"
                >
                  <option value="">-- Position --</option>
                  {Array.from({ length: selectedParticipants.length }, (_, i) => i + 1).map(
                    (pos) => (
                      <option
                        key={pos}
                        value={pos}
                        disabled={selectedParticipants.some((sp) => sp.position === pos)}
                      >
                        {pos}
                      </option>
                    )
                  )}
                </select>
              </div>
            ))}
            <button
              className="text-blue-500 underline mt-2"
              onClick={handleResetPositions}
            >
              Réinitialiser les positions
            </button>
            <div className="flex justify-between mt-4">
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded" onClick={handlePreviousStep}>
                Précédent
              </button>
              <button className="bg-blue-500 text-white py-2 px-4 rounded" onClick={handleNextStep}>
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Étape 4 : Confirmation */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            <p className="mb-2">
              <strong>Date :</strong> {date}
            </p>
            <p className="mb-2">
              <strong>Participants :</strong>
            </p>
            <ul className="list-disc ml-5">
              {selectedParticipants
                .sort((a, b) => a.position - b.position)
                .map((p) => (
                  <li key={p.userId}>
                    {participants.find((user) => user.id === p.userId)?.username} - Position :{' '}
                    {p.position}
                  </li>
                ))}
            </ul>
            <div className="flex justify-between mt-4">
              <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded" onClick={handlePreviousStep}>
                Précédent
              </button>
              <button className="bg-green-500 text-white py-2 px-4 rounded" onClick={handleSubmit}>
                Confirmer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameCreationPopup;
