import React from 'react';

interface CountryCardProps {
  country: {
    code: string;
    name: string;
    lastElection: {
      type: string;
      year: number;
      nextElectionYear: number;
    };
  };
}

const HomeCountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const flagUrl = `https://flagcdn.com/w160/${country.code.toLowerCase()}.png`;
  
  return (
    <a 
      href={`/countries/${country.code.toLowerCase()}`}
      className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105"
    >
      <div className="flex items-center p-4">
        <div className="flex-grow">
          <h2 className="text-2xl font-bold text-africa-primary mb-2">{country.name}</h2>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-600">Dernière Élection:</span>
              <p className="font-semibold">
                {country.lastElection.type} ({country.lastElection.year})
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Prochaine Élection:</span>
              <p className="font-semibold">{country.lastElection.nextElectionYear}</p>
            </div>
          </div>
        </div>
        <div className="w-32 h-20 ml-4">
          <img
            src={flagUrl}
            alt={`Drapeau ${country.name}`}
            className="w-full h-full object-cover rounded"
            loading="lazy"
          />
        </div>
      </div>
    </a>
  );
};

export default HomeCountryCard;
