import React, { useState } from 'react';
import { 
  FaFilter, 
  FaGlobeAfrica, 
  FaVoteYea, 
  FaBalanceScale 
} from 'react-icons/fa';

const filterSections = [
  {
    title: 'Régions',
    icon: FaGlobeAfrica,
    items: [
      { label: 'Afrique du Nord', count: 5, key: 'north' },
      { label: 'Afrique de l\'Ouest', count: 15, key: 'west' },
      { label: 'Afrique Centrale', count: 8, key: 'central' },
      { label: 'Afrique de l\'Est', count: 10, key: 'east' },
      { label: 'Afrique Australe', count: 6, key: 'south' }
    ]
  },
  {
    title: 'Type d\'Élection',
    icon: FaVoteYea,
    items: [
      { label: 'Présidentielle', count: 12, key: 'presidential' },
      { label: 'Législative', count: 20, key: 'legislative' },
      { label: 'Municipale', count: 8, key: 'municipal' },
      { label: 'Référendum', count: 3, key: 'referendum' }
    ]
  },
  {
    title: 'Statut Électoral',
    icon: FaBalanceScale,
    items: [
      { label: 'Élection Prochaine', count: 7, key: 'upcoming' },
      { label: 'Élection Récente', count: 15, key: 'recent' },
      { label: 'En Préparation', count: 5, key: 'preparation' }
    ]
  }
];

interface FilterState {
  [key: string]: boolean;
}

const CountrySidebar: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = (key: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(activeFilters).filter(Boolean).length;
  };

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-africa-primary text-white rounded-full p-4 shadow-lg hover:bg-africa-secondary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle filters"
      >
        <FaFilter className="w-6 h-6" />
        {getActiveFiltersCount() > 0 && (
          <span className="absolute -top-2 -right-2 bg-africa-accent text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {getActiveFiltersCount()}
          </span>
        )}
      </button>

      <div className={`
        fixed lg:relative inset-0 z-40
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-transform duration-300 ease-in-out
        lg:block ${isOpen ? 'block' : 'hidden'}
        bg-white/95 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none
      `}>
        <div className="h-full lg:h-auto overflow-y-auto lg:overflow-visible">
          <div className="container-narrow mx-auto lg:mx-0 p-4 lg:p-6">
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 lg:sticky lg:top-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <FaFilter className="mr-2 text-africa-secondary" />
                  <h2 className="text-xl font-bold text-africa-dark">Filtres</h2>
                </div>
                {/* Close button for mobile */}
                <button
                  className="lg:hidden text-africa-gray-600 hover:text-africa-dark transition-colors"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close filters"
                >
                  ×
                </button>
              </div>

              <div className="stack-lg">
                {filterSections.map(section => (
                  <div key={section.title} className="space-y-4">
                    <div className="flex items-center">
                      <section.icon className="mr-2 text-africa-accent" />
                      <h3 className="font-semibold text-africa-dark">
                        {section.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {section.items.map(item => (
                        <label 
                          key={item.key}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-africa-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="form-checkbox"
                              checked={!!activeFilters[item.key]}
                              onChange={() => toggleFilter(item.key)}
                            />
                            <span className="ml-2 text-africa-dark">{item.label}</span>
                          </div>
                          <span className="text-sm text-africa-gray-600">({item.count})</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 border-t border-africa-gray-200">
                <button
                  className="w-full bg-africa-primary text-white py-2 rounded-lg hover:bg-africa-secondary transition-colors"
                  onClick={() => setActiveFilters({})}
                >
                  Réinitialiser les Filtres
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CountrySidebar;
