import React, { useState } from 'react';
    import { FaFileAlt, FaLink, FaCalendarAlt } from 'react-icons/fa';

    interface LegalDocument {
      title: string;
      type: string;
      year: number;
      url?: string;
      description: string;
    }

    interface LegalFrameworkProps {
      documents: LegalDocument[];
      timeline: Array<{
        year: number;
        event: string;
        type: 'constitution' | 'election-law' | 'amendment'
      }>;
    }

    const LegalFramework: React.FC<LegalFrameworkProps> = ({ 
      documents, 
      timeline 
    }) => {
      const [activeTab, setActiveTab] = useState<'documents' | 'timeline'>('documents');

      const renderTimelineIcon = (type: string) => {
        switch(type) {
          case 'constitution': return <FaFileAlt className="text-blue-500" />;
          case 'election-law': return <FaLink className="text-green-500" />;
          case 'amendment': return <FaCalendarAlt className="text-red-500" />;
          default: return null;
        }
      };

      return (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex mb-6 border-b">
            <button
              className={`
                px-4 py-2 mr-2 
                ${activeTab === 'documents' 
                  ? 'border-b-2 border-africa-secondary text-africa-secondary' 
                  : 'text-gray-600'}
              `}
              onClick={() => setActiveTab('documents')}
            >
              Documents Légaux
            </button>
            <button
              className={`
                px-4 py-2 
                ${activeTab === 'timeline' 
                  ? 'border-b-2 border-africa-secondary text-africa-secondary' 
                  : 'text-gray-600'}
              `}
              onClick={() => setActiveTab('timeline')}
            >
              Chronologie
            </button>
          </div>

          {activeTab === 'documents' && (
            <div className="grid md:grid-cols-2 gap-4">
              {documents.map((doc, index) => (
                <div 
                  key={index} 
                  className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center mb-2">
                    <FaFileAlt className="mr-2 text-africa-accent" />
                    <h3 className="font-semibold">{doc.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {doc.type} - {doc.year}
                    </span>
                    {doc.url && (
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-africa-secondary hover:underline"
                      >
                        Consulter
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="relative pl-6 border-l-2 border-gray-200">
              {timeline.map((item, index) => (
                <div 
                  key={index} 
                  className="mb-4 pl-4 relative"
                >
                  <div className="absolute left-[-23px] top-1 rounded-full p-2 bg-white border-2 border-gray-200">
                    {renderTimelineIcon(item.type)}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-africa-primary">
                      {item.year} - {item.event}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    };

    export default LegalFramework;
