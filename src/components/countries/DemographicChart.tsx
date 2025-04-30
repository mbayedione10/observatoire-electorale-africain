import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { FaSpinner } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface DemographicChartProps {
  demographics: {
    gender: {
      male: number;
      female: number;
    };
    genderRatio:{
      male: number;
      female: number;
    };
    voterRegistration: {
      registered: number;
      population: number;
    };
  };
}

const DemographicChart: React.FC<DemographicChartProps> = ({ demographics }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      // Verify data structure
      if (!demographics?.genderRatio || !demographics?.gender || !demographics?.voterRegistration) {
        throw new Error('Invalid demographic data structure');
      }
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load demographic data');
      setIsLoading(false);
    }
  }, [demographics]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-africa-primary" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  // Data validation
  if (!demographics?.genderRatio?.male || 
      !demographics?.gender?.male || 
      !demographics?.voterRegistration?.registered) {
    return (
      <div className="text-gray-600 text-center p-4">
        Données démographiques non disponibles
      </div>
    );
  }

  const genderRatioData = {
    labels: ['Hommes', 'Femmes'],
    datasets: [
      {
        data: [demographics.genderRatio.male, demographics.genderRatio.female],
        backgroundColor: [
          'rgba(67, 185, 127, 0.6)',
          'rgba(45, 131, 245, 0.6)',
        ],
        borderColor: [
          'rgba(67, 185, 127, 0.6)',
          'rgba(45, 131, 245, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const genderData = {
    labels: ['Hommes', 'Femmes'],
    datasets: [
      {
        data: [demographics.gender.male, demographics.gender.female],
        backgroundColor: [
          'rgba(67, 185, 127, 0.6)',
          'rgba(45, 131, 245, 0.6)',
        ],
        borderColor: [
          'rgba(67, 185, 127, 0.6)',
          'rgba(45, 131, 245, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const voterData = {
    labels: ['Population', 'Electeurs'],
    datasets: [
      {
        data: [
          demographics.voterRegistration.population,
          demographics.voterRegistration.registered
        ],
        backgroundColor: [
          '#FF5836',
          '#FFC24A',
        ],
        borderColor: [
          '#FF5836',
          '#FFC24A',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        enabled: true,
        mode: 'index' as const,
        intersect: false,
        padding: 10
      }
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        beginAtZero: true,
        ticks: {
          callback: function(tickValue: string | number) {
            return tickValue;
          }
        }
      }
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {/* Répartition par Genre */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-center text-africa-primary">
          Répartition de la Population par Genre
        </h3>
        <div className="h-64">
          <Doughnut data={genderData} options={chartOptions} />
        </div>
      </div>

      {/* Inscription Électorale */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-center text-africa-primary">
          Inscription Électorale
        </h3>
        <div className="h-64">
          <Bar data={voterData} options={{...chartOptions, plugins: {legend: {display: false}}}} />
        </div>
        <div className="mt-2 flex justify-center space-x-4">
          <div className="flex items-center">
            <span className="inline-block ml-2 w-3 h-3 mr-2 bg-[#FF5836] rounded-full"></span>
            <span className="text-sm text-gray-600">Population</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block w-5 h-3 mr-2 bg-[#FFC24A] rounded-full"></span>
            <span className="text-sm text-gray-600">Électeurs inscrits</span>
          </div>
        </div>
        <div className="mt-3 text-center text-sm text-gray-600">
          Taux d'inscription : {((demographics.voterRegistration.registered / demographics.voterRegistration.population) * 100).toFixed(1)}%
        </div>
    </div>
      {/* Répartition electoral en genre */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-center text-africa-primary">
          Répartition Électorale par Genre
        </h3>
        <div className="h-64">
            <Doughnut data={genderRatioData} options={chartOptions} />
        </div>
      </div>  

      

    </div>
  );
};

export default DemographicChart;