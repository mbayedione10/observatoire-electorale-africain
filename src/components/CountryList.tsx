import React from 'react';
import CountryCard from './countries/CountryCard';

interface Country {
  code: string;
  name: string;
  population: number;
  politicalSystem?: string;
  demographics: {
    voterRegistration: {
      population: number;
      registered: number;
    };
  };
  lastElection: {
    turnout: number;
    type?: string;
    date?: string;
    year?: number;
  };
}

interface CountryListProps {
  countries: Country[];
}

const CountryList: React.FC<CountryListProps> = ({ countries }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <CountryCard key={country.code} country={country} />
        ))}
      </div>
    </div>
  );
};

export default CountryList;
