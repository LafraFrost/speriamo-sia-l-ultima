import React, { useState, useEffect } from 'react';
import { calculateBolloSequence } from '../services/bolloCalculator';
import { Region, FuelType, EuroClass, BolloResult } from '../types';
import { Info, Calculator, Calendar, Zap, MapPin, Car, ArrowRight, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BolloTabProps {
  duration: number;
  onDurationChange: (years: number) => void;
  // Vehicle State Props
  carName: string; setCarName: (v: string) => void;
  kw: number | ""; setKw: (v: number | "") => void;
  region: Region | ""; setRegion: (v: Region | "") => void;
  fuel: FuelType | ""; setFuel: (v: FuelType | "") => void;
  euroClass: EuroClass | ""; setEuroClass: (v: EuroClass | "") => void;
  regYear: number | ""; setRegYear: (v: number | "") => void;
  directDebit: boolean; setDirectDebit: (v: boolean) => void;
  onReset: () => void;
}

const BolloTab: React.FC<BolloTabProps> = ({ 
  duration, 
  onDurationChange,
  carName, setCarName,
  kw, setKw,
  region, setRegion,
  fuel, setFuel,
  euroClass, setEuroClass,
  regYear, setRegYear,
  directDebit, setDirectDebit,
  onReset
}) => {
  const currentYear = new Date().getFullYear();
  const [results, setResults] = useState<BolloResult[]>([]);

  // Check if form is valid for calculation
  const isValid = region !== "" && fuel !== "" && euroClass !== "";

  useEffect(() => {
    if (isValid) {
      // Safe cast for calculation
      const safeKw = kw === "" ? 0 : kw;
      const safeRegYear = regYear === "" ? currentYear : regYear;

      const data = calculateBolloSequence(
        safeKw, 
        region as Region, 
        fuel as FuelType, 
        euroClass as EuroClass, 
        safeRegYear, 
        duration,
        directDebit
      );
      setResults(data);
    } else {
      setResults([]);
    }
  }, [kw, region, fuel, euroClass, regYear, duration, isValid, currentYear, directDebit]);

  const totalCost = results.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Calculator size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-800">Dati Veicolo</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nome Veicolo (Opzionale)</label>
              <div className="relative">
                <Car className="absolute left-3 top-3 text-slate-400" size={16} />
                <input 
                  type="text"
                  placeholder="Es. Fiat Panda, Tesla Model 3..."
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Regione di Residenza</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value as Region)}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${!region ? 'text-slate-500' : 'text-slate-900'}`}
                >
                  <option value="" disabled>Seleziona Regione...</option>
                  {Object.values(Region).map(r => <option key={r} value={r} className="text-slate-900">{r}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Anno Immatricolazione</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input 
                    type="number"
                    min="1990"
                    max={currentYear}
                    value={regYear}
                    onChange={(e) => setRegYear(e.target.value === "" ? "" : parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Potenza (kW)</label>
                <div className="relative">
                  <Zap className="absolute left-3 top-3 text-slate-400" size={16} />
                  <input 
                    type="number"
                    min="0"
                    value={kw}
                    onChange={(e) => setKw(e.target.value === "" ? "" : parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Carburante</label>
                <select 
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value as FuelType)}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${!fuel ? 'text-slate-500' : 'text-slate-900'}`}
                >
                  <option value="" disabled>Seleziona...</option>
                  {Object.values(FuelType).map(f => <option key={f} value={f} className="text-slate-900">{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Classe Euro</label>
                <select 
                  value={euroClass}
                  onChange={(e) => setEuroClass(e.target.value as EuroClass)}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${!euroClass ? 'text-slate-500' : 'text-slate-900'}`}
                >
                  <option value="" disabled>Seleziona...</option>
                  {Object.values(EuroClass).map(e => <option key={e} value={e} className="text-slate-900">{e}</option>)}
                </select>
              </div>
            </div>

            {/* Direct Debit Checkbox */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
               <div className="text-indigo-600">
                 <CreditCard size={20} />
               </div>
               <label className="flex items-center gap-2 cursor-pointer flex-1 select-none">
                 <input 
                    type="checkbox"
                    checked={directDebit}
                    onChange={(e) => setDirectDebit(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 border-slate-300"
                 />
                 <span className="text-sm font-medium text-slate-700">Applica sconto domiciliazione bancaria</span>
               </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">
                Proiezione: {duration} Anni
              </label>
              <input 
                type="range"
                min="1"
                max="20"
                value={duration}
                onChange={(e) => onDurationChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>
        </div>

        {/* Results Overview */}
        <div className="flex flex-col gap-6">
           {isValid && results.length > 0 ? (
             <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                  <p className="text-indigo-100 text-sm font-medium mb-1">Totale stimato ({duration} anni)</p>
                  {carName && <p className="text-white text-lg font-bold mb-2 truncate">{carName}</p>}
                  <h3 className="text-3xl font-bold">€{totalCost.toFixed(2)}</h3>
                  <p className="text-indigo-200 text-xs mt-2">Media: €{(totalCost / duration).toFixed(2)} / anno</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-2">
                      <Info className="text-emerald-500" size={18} />
                      <span className="text-slate-500 text-sm font-medium">Stato Esenzione</span>
                   </div>
                   {results[0]?.isExempt ? (
                     <div className="text-emerald-600 font-bold text-lg">
                        Attiva
                        <span className="block text-xs font-normal text-slate-500 mt-1">{results[0].message}</span>
                     </div>
                   ) : (
                     <div className="text-slate-800 font-bold text-lg">
                        Non Attiva
                        <span className="block text-xs font-normal text-slate-500 mt-1">{results[0]?.message}</span>
                     </div>
                   )}
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1 min-h-[250px] animate-fade-in">
                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Andamento Spesa</h4>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="year" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        tickFormatter={(val) => `€${val}`}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="amount" radius={[6, 6, 0, 0]} animationDuration={1000}>
                        {results.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isExempt ? '#10b981' : '#6366f1'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
               <div className="bg-slate-50 p-4 rounded-full mb-4">
                 <ArrowRight className="text-slate-400" size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-800 mb-2">Compila i dati</h3>
               <p className="text-slate-500 text-sm max-w-xs">
                 Seleziona Regione, Carburante e Classe Euro per visualizzare il calcolo del bollo e le esenzioni.
               </p>
             </div>
           )}
        </div>
      </div>

      {/* Detail Table */}
      {isValid && results.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Dettaglio Annuale</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-6 py-3 font-medium">Anno</th>
                  <th className="px-6 py-3 font-medium">Stato</th>
                  <th className="px-6 py-3 font-medium text-right">Importo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map((r, i) => (
                  <tr key={r.year} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700">{r.year}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        r.isExempt ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {r.message}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right font-bold text-slate-700">€{r.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BolloTab;