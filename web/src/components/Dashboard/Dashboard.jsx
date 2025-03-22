import React from 'react';
import MapWidget from '../MapWidget/MapWidget';

// Composant Header avec des statistiques
const Header = () => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full px-4 sm:px-6 py-3">
    <div className="flex items-baseline mb-3 sm:mb-0">
      <h1 className="text-2xl sm:text-3xl font-bold mr-2 sm:mr-4">Dashboard</h1>
      <span className="text-sm sm:text-base text-gray-500">11 fev. 2025</span>
    </div>
    
    <div className="flex space-x-4 sm:space-x-8">
      <div className="text-right">
        <div className="text-xl sm:text-3xl font-bold">500</div>
        <div className="text-xs sm:text-sm text-gray-500">Capteurs</div>
      </div>
      
      <div className="text-right">
        <div className="text-xl sm:text-3xl font-bold">300</div>
        <div className="text-xs sm:text-sm text-gray-500">utilisateurs</div>
      </div>
    </div>
  </div>
);

// Composant de barre latérale
const Sidebar = () => (
  <div className="h-screen bg-white w-14 flex flex-col items-center py-8 shadow-md">
    <div className="w-8 h-8 mb-8 bg-blue-500 rounded-md flex items-center justify-center text-white">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    
    <button className="w-10 h-10 mb-6 flex items-center justify-center text-blue-500 hover:bg-gray-100 rounded-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    </button>
    
    <button className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-md">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </button>
  </div>
);

// Composant fictif pour les graphiques
const ChartsWidget = () => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full">
    <h2 className="text-2xl font-bold mb-6">CHARTS</h2>
    <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Graphiques à venir...</p>
    </div>
  </div>
);

// Composant fictif pour la liste des utilisateurs
const UsersWidget = () => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="flex space-x-2">
        <button className="px-4 py-2 bg-gray-200 rounded-full text-sm">Pays</button>
        <button className="px-4 py-2 bg-gray-200 rounded-full text-sm">Taille</button>
      </div>
    </div>
    <h3 className="text-xl font-bold mt-10 mb-2">LIST</h3>
    <div className="h-[200px] flex items-center justify-center">
      <p className="text-gray-500">Liste des utilisateurs à venir...</p>
    </div>
  </div>
);

// Composant fictif pour les mesures
const MeasuresWidget = () => (
  <div className="bg-white p-6 rounded-lg shadow-md w-full">
    <h2 className="text-2xl font-bold mb-6">MESURES</h2>
    <h3 className="text-xl font-bold mt-10 mb-2">LIST</h3>
    <div className="h-[200px] flex items-center justify-center">
      <p className="text-gray-500">Liste des mesures à venir...</p>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
          <div className="md:col-span-7">
            <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
              <MapWidget />
              <ChartsWidget />
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
              <UsersWidget />
              <MeasuresWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;