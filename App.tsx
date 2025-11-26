import React, { useState } from 'react';
import BolloTab from './components/BolloTab';
import FuelTab from './components/FuelTab';
import CompareTab from './components/CompareTab';
import { Car, Zap, HelpCircle, LayoutDashboard } from 'lucide-react';

enum Tab {
  BOLLO = 'bollo',
  FUEL = 'fuel',
  COMPARE = 'compare',
  INFO = 'info'
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.BOLLO);
  const [garageLastUpdated, setGarageLastUpdated] = useState(Date.now());
  const [sharedDuration, setSharedDuration] = useState(5);

  const handleGarageUpdate = () => {
    setGarageLastUpdated(Date.now());
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Car className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">EcoBollo Calculator</h1>
            <h1 className="text-xl font-bold text-slate-800 sm:hidden">EcoBollo</h1>
          </div>
          <div className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
            v2.2
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Mobile-first Tab Navigation */}
        <div className="flex p-1 bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab(Tab.BOLLO)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.BOLLO 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Zap size={18} />
            <span className="whitespace-nowrap">Bollo Auto</span>
          </button>
          <button
            onClick={() => setActiveTab(Tab.FUEL)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.FUEL 
                ? 'bg-orange-500 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Car size={18} />
            <span>Consumi</span>
          </button>
          <button
            onClick={() => setActiveTab(Tab.COMPARE)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.COMPARE 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="whitespace-nowrap">Garage</span>
          </button>
          <button
            onClick={() => setActiveTab(Tab.INFO)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === Tab.INFO 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HelpCircle size={18} />
            <span>Info</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          <div className={activeTab === Tab.BOLLO ? 'block' : 'hidden'}>
            <BolloTab 
              onGarageUpdate={handleGarageUpdate} 
              duration={sharedDuration}
              onDurationChange={setSharedDuration}
            />
          </div>
          
          <div className={activeTab === Tab.FUEL ? 'block' : 'hidden'}>
            <FuelTab duration={sharedDuration} />
          </div>
          
          <div className={activeTab === Tab.COMPARE ? 'block' : 'hidden'}>
            <CompareTab lastUpdated={garageLastUpdated} />
          </div>
          
          <div className={activeTab === Tab.INFO ? 'block' : 'hidden'}>
            <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Cos'è il bollo auto?</h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Il bollo auto è una tassa di possesso obbligatoria versata alla Regione di residenza. 
                  L'importo varia in base alla potenza (kW) e alla classe ambientale (Euro 0-6).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                        <h3 className="font-semibold text-indigo-900 mb-2">Fattori Chiave</h3>
                        <ul className="text-sm text-indigo-800 space-y-1">
                            <li>• Potenza Motore (kW)</li>
                            <li>• Regione di Residenza</li>
                            <li>• Classe Euro</li>
                            <li>• Anno Immatricolazione</li>
                        </ul>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <h3 className="font-semibold text-emerald-900 mb-2">Agevolazioni</h3>
                        <ul className="text-sm text-emerald-800 space-y-1">
                            <li>• Auto Elettriche (spesso 5 anni gratis)</li>
                            <li>• Auto Ibride (spesso 3 anni gratis)</li>
                            <li>• Auto d'Epoca (+30 anni)</li>
                            <li>• Legge 104</li>
                        </ul>
                    </div>
                </div>
              </section>

              <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Disclaimer</h3>
                  <p className="text-sm text-slate-500">
                      Questa applicazione fornisce stime basate sulle tariffe medie regionali italiane 2024. 
                      Per il calcolo ufficiale e vincolante, si prega di consultare il sito dell'ACI o della propria Regione di residenza.
                  </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;