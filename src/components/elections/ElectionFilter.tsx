import React, { useState } from 'react';
import { 
  FaFilter, 
  FaGlobeAfrica, 
  FaVoteYea, 
  FaCalendarAlt 
} from 'react-icons/fa';
import FloatingActionButton from '../common/FloatingActionButton';

const electionTypeOptions = [
  'Présidentielle',
  'Législative',
  'Locales',
  'Référendum'
];

const regionOptions = [
  'Afrique du Nord',
  'Afrique de l\'Ouest',
  'Afrique Centrale',
  'Afrique de l\'Est',
  'Afrique Australe'
];

const statusOptions = [
  'À venir',
  'En cours',
  'Terminée',
  'Contestée'
];

interface ElectionFilterProps {
  onFilterChange: (filters: {
    types: string[];
    regions: string[];
    status: string[];
    yearRange: [number, number];
  }) => void;
}

const ElectionFilter: React.FC<ElectionFilterProps> = ({ onFilterChange }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([
    2024, 
    new Date().getFullYear() + 2
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = () => {
    onFilterChange({
      types: selectedTypes,
      regions: selectedRegions,
      status: selectedStatus,
      yearRange
    });
  };

  const getActiveFiltersCount = () => {
    return selectedTypes.length + selectedRegions.length + selectedStatus.length;
  };

  return (
    <>
      {/* Replace the old mobile filter toggle with new FAB */}
      <FloatingActionButton 
        onClick={() => setIsOpen(!isOpen)}
        isActive={isOpen}
        badgeCount={getActiveFiltersCount()}
      />

      <div 
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out
          lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
      />

      <div className={`
        fixed inset-y-0 left-0 z-40 w-full sm:w-[320px]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:w-full
        bg-white/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
      `}>
        <div className="h-full lg:h-auto overflow-y-auto">
          <div className="container-narrow mx-auto lg:mx-0 p-4 lg:p-6">
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaFilter className="mr-2 text-africa-secondary" />
                  <h2 className="text-xl font-bold text-africa-primary">
                    Filtres Électoraux
                  </h2>
                </div>
                {/* Close button for mobile */}
                <button
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close filters"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Election Type Filter */}
              <div className="stack-lg">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaVoteYea className="mr-2 text-africa-accent" />
                    <h3 className="font-semibold text-africa-primary">
                      Type d'Élection
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {electionTypeOptions.map(type => (
                      <label 
                        key={type} 
                        className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => {
                            setSelectedTypes(prev => 
                              prev.includes(type) 
                                ? prev.filter(t => t !== type)
                                : [...prev, type]
                            );
                          }}
                        />
                        <span className="ml-2">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Region Filter */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaGlobeAfrica className="mr-2 text-africa-accent" />
                    <h3 className="font-semibold text-africa-primary">
                      Régions
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {regionOptions.map(region => (
                      <label 
                        key={region} 
                        className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={selectedRegions.includes(region)}
                          onChange={() => {
                            setSelectedRegions(prev => 
                              prev.includes(region) 
                                ? prev.filter(r => r !== region)
                                : [...prev, region]
                            );
                          }}
                        />
                        <span className="ml-2">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaVoteYea className="mr-2 text-africa-accent" />
                    <h3 className="font-semibold text-africa-primary">
                      Statut
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {statusOptions.map(status => (
                      <label 
                        key={status} 
                        className="flex items-center p-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={selectedStatus.includes(status)}
                          onChange={() => {
                            setSelectedStatus(prev => 
                              prev.includes(status) 
                                ? prev.filter(s => s !== status)
                                : [...prev, status]
                            );
                          }}
                        />
                        <span className="ml-2">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year Range Filter */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2 text-africa-accent" />
                    <h3 className="font-semibold text-africa-primary">
                      Période
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm text-gray-600 mb-1">De</label>
                      <input
                        type="number"
                        min="2024"
                        max={new Date().getFullYear() + 5}
                        value={yearRange[0]}
                        onChange={(e) => setYearRange([Number(e.target.value), yearRange[1]])}
                        className="w-full sm:w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-africa-accent focus:border-transparent"
                      />
                    </div>
                    <div className="hidden sm:block">-</div>
                    <div className="w-full sm:w-auto">
                      <label className="block text-sm text-gray-600 mb-1">À</label>
                      <input
                        type="number"
                        min="2024"
                        max={new Date().getFullYear() + 5}
                        value={yearRange[1]}
                        onChange={(e) => setYearRange([yearRange[0], Number(e.target.value)])}
                        className="w-full sm:w-24 px-3 py-2 border rounded-md focus:ring-2 focus:ring-africa-accent focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={updateFilters}
                  className="btn-primary flex-grow"
                >
                  Appliquer les Filtres
                </button>
                <button
                  onClick={() => {
                    setSelectedTypes([]);
                    setSelectedRegions([]);
                    setSelectedStatus([]);
                    setYearRange([2024, new Date().getFullYear() + 2]);
                    onFilterChange({
                      types: [],
                      regions: [],
                      status: [],
                      yearRange: [2024, new Date().getFullYear() + 2]
                    });
                  }}
                  className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 flex-grow"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ElectionFilter;