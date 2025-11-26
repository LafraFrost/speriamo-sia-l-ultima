import React, { useState, useEffect } from 'react';
import { SavedCar } from '../types';
import { calculateBolloSequence } from '../services/bolloCalculator';
import { Trash2, Car, TrendingUp, BarChart2, Calendar, Clock, ArrowRight } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';

const FUEL_PRICE_AVG = 1.85; // Default average price for comparison
const COLORS = ['#6366f1', '#f97316', '#10b981', '#ec4899', '#8b5cf6', '#0ea5e9', '#eab308'];

interface CompareTabProps {
  lastUpdated?: number;
}

const CompareTab: React.FC<CompareTabProps> = ({ lastUpdated }) => {
  const [savedCars, setSavedCars] = useState<SavedCar[]>([]);
  const [projectionYears, setProjectionYears] = useState<number>(10);
  const [lineChartData, setLineChartData] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any[]>([]);

  useEffect(() => {
    loadCars();
  }, [lastUpdated]);

  const loadCars = () => {
    const carsJson = localStorage.getItem('ecoBollo_garage');
    if (carsJson) {
      setSavedCars(JSON.parse(carsJson));
    }
  };

  const deleteCar = (id: string) => {
    const updatedCars = savedCars.filter(c => c.id !== id);
    localStorage.setItem('ecoBollo_garage', JSON.stringify(updatedCars));
    setSavedCars(updatedCars);
  };

  useEffect(() => {
    if (savedCars.length === 0) {
      setLineChartData([]);
      setSummaryData([]);
      return;
    }

    // 1. Calculate sequences for each car
    const carSequences = savedCars.map(car => {
      // Get bollo sequence for N years
      const bolloSeq = calculateBolloSequence(
        car.kw, 
        car.region, 
        car.fuel, 
        car.euroClass, 
        car.regYear, 
        projectionYears,
        car.directDebit // Pass persisted direct debit preference
      );
      
      // Calculate constant annual fuel (could be improved with inflation)
      const consumption = car.consumption || 15; // default fallback if missing
      const km = car.kmAnnual || 10000;
      const annualFuelCost = (km / 100) * consumption * FUEL_PRICE_AVG;

      // Build cumulative data
      let runningTotal = 0;
      const yearData = bolloSeq.map((b) => {
        const totalYearly = b.amount + annualFuelCost;
        runningTotal += totalYearly;
        return {
          year: b.year,
          label: b.yearLabel,
          bollo: b.amount,
          fuel: annualFuelCost,
          totalYearly,
          cumulative: runningTotal
        };
      });

      return { car, yearData, totalCost: runningTotal };
    });

    // 2. Format data for Line Chart (Cumulative Trends)
    // Structure: [{ year: 'Anno 1', carId1: 1000, carId2: 1200 }, ...]
    const chartData = Array.from({ length: projectionYears }, (_, i) => {
      const item: any = { name: `Anno ${i + 1}` };
      carSequences.forEach(seq => {
        item[seq.car.id] = parseFloat(seq.yearData[i].cumulative.toFixed(0));
        item[`${seq.car.id}_name`] = seq.car.name;
      });
      return item;
    });
    setLineChartData(chartData);

    // 3. Format data for Bar Chart (Total Summary)
    const summary = carSequences.map(seq => ({
      name: seq.car.name,
      totalBollo: seq.yearData.reduce((sum, y) => sum + y.bollo, 0),
      totalFuel: seq.yearData.reduce((sum, y) => sum + y.fuel, 0),
      total: seq.totalCost,
      id: seq.car.id
    }));
    setSummaryData(summary);

  }, [savedCars, projectionYears]);

  if (savedCars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 text-center animate-fade-in">
        <div className="p-4 bg-slate-100 rounded-full mb-4">
          <Car size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Il Garage è vuoto</h3>
        <p className="text-slate-500 max-w-md">
          Vai alla scheda "Bollo Auto", inserisci i dati di un veicolo e clicca su "Salva nel Garage" per confrontarli qui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Clock className="text-indigo-600" size={20} />
            Orizzonte Temporale
          </h2>
          <p className="text-sm text-slate-500">Seleziona per quanti anni vuoi proiettare i costi</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-1/2">
          <span className="text-sm font-medium text-slate-600 min-w-[3rem]">1 Anno</span>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={projectionYears}
            onChange={(e) => setProjectionYears(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <span className="text-sm font-bold text-indigo-600 min-w-[4rem] text-right">{projectionYears} Anni</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedCars.map((car, index) => (
          <div key={car.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative group transition-all hover:shadow-md">
            <div 
              className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }} 
            />
            <button 
              onClick={() => deleteCar(car.id)}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
              title="Elimina"
            >
              <Trash2 size={18} />
            </button>
            
            <div className="flex items-center gap-3 mb-4 pl-3">
              <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                <Car size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 truncate max-w-[150px]">{car.name}</h3>
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full uppercase">
                  {car.fuel} • {car.kw} kW
                </span>
              </div>
            </div>

            <div className="space-y-2 pl-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Regione</span>
                <span className="font-medium text-slate-700">{car.region}</span>
              </div>
              {(car.consumption && car.kmAnnual) && (
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Consumo</span>
                    <span className="font-medium text-slate-700">{car.consumption} L/100km</span>
                 </div>
              )}
               <div className="pt-3 mt-2 border-t border-slate-50 flex justify-between items-end">
                <span className="text-xs text-slate-400">Totale stimato<br/>({projectionYears} anni)</span>
                <span className="text-lg font-bold text-slate-800">
                  €{summaryData.find(s => s.id === car.id)?.total.toLocaleString('it-IT', {maximumFractionDigits: 0})}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Line Chart: Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-indigo-600" size={20} />
            <div>
              <h3 className="text-lg font-bold text-slate-800">Andamento Cumulativo</h3>
              <p className="text-xs text-slate-400">Costo totale accumulato anno per anno</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `€${val/1000}k`} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number, name: string, props: any) => {
                     // Find car name corresponding to dataKey (which is car ID)
                     const carId = props.dataKey;
                     const carName = props.payload[`${carId}_name`] || name;
                     return [`€${value.toLocaleString()}`, carName];
                  }}
                  labelStyle={{ color: '#64748b', marginBottom: '0.5rem' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                {savedCars.map((car, index) => (
                  <Line 
                    key={car.id} 
                    type="monotone" 
                    dataKey={car.id} 
                    name={car.name}
                    stroke={COLORS[index % COLORS.length]} 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Composition */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="text-indigo-600" size={20} />
            <div>
               <h3 className="text-lg font-bold text-slate-800">Composizione Costi ({projectionYears} Anni)</h3>
               <p className="text-xs text-slate-400">Suddivisione tra Bollo e Carburante</p>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summaryData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={100} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => `€${value.toLocaleString()}`}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="totalBollo" name="Bollo Totale" stackId="a" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={30} />
                <Bar dataKey="totalFuel" name="Carburante Totale" stackId="a" fill="#f97316" radius={[0, 4, 4, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Dettaglio Totale per {projectionYears} Anni</h3>
           </div>
           <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
             Prezzo carburante stimato: €{FUEL_PRICE_AVG}/L
           </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-6 py-3 font-medium">Veicolo</th>
                <th className="px-6 py-3 font-medium text-right">Bollo Totale</th>
                <th className="px-6 py-3 font-medium text-right">Carburante Totale</th>
                <th className="px-6 py-3 font-medium text-right text-indigo-600">Grand Total</th>
                <th className="px-6 py-3 font-medium text-right">Costo / Anno</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {summaryData.map((data, index) => (
                <tr key={data.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3 font-medium text-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {data.name}
                  </td>
                  <td className="px-6 py-3 text-right">€{data.totalBollo.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="px-6 py-3 text-right">€{data.totalFuel.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="px-6 py-3 text-right font-bold text-indigo-600">€{data.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                  <td className="px-6 py-3 text-right text-slate-500">€{(data.total / projectionYears).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompareTab;