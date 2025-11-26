import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Fuel, TrendingUp, Gauge, Save, Check, AlertCircle } from 'lucide-react';
import { Region, FuelType, EuroClass, SavedCar } from '../types';

interface FuelData {
  year: number;
  totalKm: number;
  liters: number;
  cost: number;
}

interface FuelTabProps {
  duration: number;
  onGarageUpdate: () => void;
  onReset: () => void;
  // Vehicle Data for Saving
  carName: string;
  kw: number | "";
  region: Region | "";
  fuel: FuelType | "";
  euroClass: EuroClass | "";
  regYear: number | "";
  directDebit: boolean;
}

const FuelTab: React.FC<FuelTabProps> = ({ 
  duration, 
  onGarageUpdate,
  onReset,
  carName, kw, region, fuel, euroClass, regYear, directDebit
}) => {
  const [consumption, setConsumption] = useState<number | "">(0); // L/100km
  const [price, setPrice] = useState<number | "">(0); // €/L
  const [kmAnnual, setKmAnnual] = useState<number | "">(0);
  const [isSaved, setIsSaved] = useState(false);

  // Use safe values for calculations (treat "" as 0)
  const safeConsumption = consumption === "" ? 0 : consumption;
  const safePrice = price === "" ? 0 : price;
  const safeKmAnnual = kmAnnual === "" ? 0 : kmAnnual;

  const annualCost = (safeKmAnnual / 100) * safeConsumption * safePrice;
  const annualLiters = (safeKmAnnual / 100) * safeConsumption;
  const costPerKm = safeKmAnnual > 0 ? annualCost / safeKmAnnual : 0;

  // Check if vehicle data from previous tab is valid
  const isVehicleValid = region !== "" && fuel !== "" && euroClass !== "";

  const chartData: FuelData[] = Array.from({ length: duration }, (_, i) => {
    const year = i + 1;
    return {
      year,
      totalKm: safeKmAnnual * year,
      liters: parseFloat((annualLiters * year).toFixed(1)),
      cost: parseFloat((annualCost * year).toFixed(2))
    };
  });

  const handleReset = () => {
    setConsumption(0);
    setPrice(0);
    setKmAnnual(0);
    setIsSaved(false);
  };

  const handleSaveCar = () => {
    if (!isVehicleValid) return;

    const currentYear = new Date().getFullYear();
    const safeKw = kw === "" ? 0 : kw;
    const safeRegYear = regYear === "" ? currentYear : regYear;

    const newCar: SavedCar = {
      id: crypto.randomUUID(),
      name: carName || `Auto ${fuel} ${safeKw}kW`,
      kw: safeKw,
      region: region as Region,
      fuel: fuel as FuelType,
      euroClass: euroClass as EuroClass,
      regYear: safeRegYear,
      consumption: safeConsumption,
      kmAnnual: safeKmAnnual,
      directDebit: directDebit,
      createdAt: Date.now()
    };

    const existingCarsJson = localStorage.getItem('ecoBollo_garage');
    const existingCars: SavedCar[] = existingCarsJson ? JSON.parse(existingCarsJson) : [];
    
    localStorage.setItem('ecoBollo_garage', JSON.stringify([...existingCars, newCar]));
    
    if (onGarageUpdate) {
      onGarageUpdate();
    }

    // Reset local state
    handleReset();
    
    // Reset vehicle data (parent state)
    onReset();
    
    // Note: We don't set isSaved=true here because we are resetting the form, 
    // so the button will likely become disabled/reset state immediately.
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Card */}
        <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
              <Fuel size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Parametri</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Consumo Medio (L/100km)
              </label>
              <div className="relative">
                <Gauge className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={consumption}
                  onChange={(e) => setConsumption(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Prezzo Carburante (€/L)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">€</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                KM Annuali
              </label>
              <div className="relative">
                 <TrendingUp className="absolute left-3 top-3 text-slate-400" size={16} />
                <input
                  type="number"
                  step="1000"
                  min="0"
                  value={kmAnnual}
                  onChange={(e) => setKmAnnual(e.target.value === "" ? "" : parseFloat(e.target.value))}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveCar}
                disabled={isSaved || !isVehicleValid}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  isSaved 
                  ? 'bg-emerald-100 text-emerald-700 cursor-default'
                  : !isVehicleValid 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                }`}
                title={!isVehicleValid ? "Compila prima i dati nella sezione Bollo Auto" : "Salva nel Garage"}
              >
                {isSaved ? (
                  <>
                    <Check size={18} />
                    Salvato
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Salva nel Garage
                  </>
                )}
              </button>
            </div>
            {!isVehicleValid && (
              <div className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg text-amber-700 text-xs mt-2">
                <AlertCircle size={14} className="mt-0.5 shrink-0" />
                <span>
                  Per salvare, devi prima inserire i dati del veicolo (Regione, Carburante, Classe Euro) nella scheda <strong>Bollo Auto</strong>.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats & Chart */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Costo Annuale</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">€{annualCost.toFixed(2)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Litri Annuali</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{annualLiters.toFixed(1)} L</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Costo per KM</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">€{costPerKm.toFixed(3)}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[300px]">
            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Costo Cumulativo ({duration} Anni)</h4>
            <div className="w-full h-full pb-8">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tickFormatter={(val) => `Anno ${val}`} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `€${val}`} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`€${value.toFixed(2)}`, "Costo Cumulativo"]}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#f97316" fillOpacity={1} fill="url(#colorCost)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FuelTab;