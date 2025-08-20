import React, { useState } from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

interface CertificationsFormProps {
  certifications: string[];
  onChange: (certifications: string[]) => void;
}

const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onChange
}) => {
  const [newCert, setNewCert] = useState('');

  const addCertification = () => {
    if (newCert.trim()) {
      onChange([...certifications, newCert.trim()]);
      setNewCert('');
    }
  };

  const removeCertification = (index: number) => {
    onChange(certifications.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCertification();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Award className="text-yellow-600" />
        Certifications
      </h2>

      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCert}
            onChange={(e) => setNewCert(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            placeholder="Add a certification (e.g., AWS Certified Solutions Architect)"
          />
          <button
            onClick={addCertification}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <span className="text-gray-800">{cert}</span>
              <button
                onClick={() => removeCertification(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {certifications.length === 0 && (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No certifications added yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationsForm;