import React from 'react';
    import { 
      FaUsers, 
      FaEnvelope, 
      FaPhone, 
      FaMapMarkerAlt 
    } from 'react-icons/fa';

    interface CSO {
      id: string;
      name: string;
      country: string;
      expertise: string[];
      contacts: {
        email: string;
        phone: string;
        address: string;
      };
    }

    interface CSOCardProps {
      cso: CSO;
      onDetailView?: (id: string) => void;
    }

    const CSOCard: React.FC<CSOCardProps> = ({ cso, onDetailView }) => {
      return (
        <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow">
          <div className="flex items-center mb-4">
            <FaUsers className="text-4xl text-africa-accent mr-4" />
            <div>
              <h2 className="text-2xl font-semibold text-africa-primary">
                {cso.name}
              </h2>
              <p className="text-gray-600">{cso.country}</p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-africa-secondary">
              Domaines d'Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {cso.expertise.map(exp => (
                <span 
                  key={exp} 
                  className="bg-africa-accent/10 text-africa-accent px-2 py-1 rounded-full text-xs"
                >
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-gray-700">
            <div className="flex items-center">
              <FaEnvelope className="mr-2 text-africa-secondary" />
              <span>{cso.contacts.email}</span>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2 text-africa-secondary" />
              <span>{cso.contacts.phone}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-2 text-africa-secondary" />
              <span>{cso.contacts.address}</span>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button 
              onClick={() => onDetailView && onDetailView(cso.id)}
              className="bg-africa-secondary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Voir Détails
            </button>
          </div>
        </div>
      );
    };

    export default CSOCard;
