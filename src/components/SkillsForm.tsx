import React, { useState } from 'react';
import { Code, Plus, Trash2, X, Sparkles } from 'lucide-react';
import { SkillCategory } from '../types/resume';

interface SkillsFormProps {
  skills: SkillCategory[];
  onChange: (skills: SkillCategory[]) => void;
  onAISuggestion: (type: string, content: string, field: string) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, onChange, onAISuggestion }) => {
  const [newSkillInput, setNewSkillInput] = useState<{ [key: number]: string }>({});

  const addSkillCategory = () => {
    onChange([...skills, { category: '', items: [] }]);
  };

  const removeSkillCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const updateCategory = (index: number, category: string) => {
    const updated = skills.map((skill, i) => 
      i === index ? { ...skill, category } : skill
    );
    onChange(updated);
  };

  const addSkillToCategory = (categoryIndex: number) => {
    const skillText = newSkillInput[categoryIndex]?.trim();
    if (!skillText) return;

    const updated = skills.map((skill, i) => 
      i === categoryIndex 
        ? { ...skill, items: [...skill.items, skillText] }
        : skill
    );
    onChange(updated);
    setNewSkillInput({ ...newSkillInput, [categoryIndex]: '' });
  };

  const removeSkillFromCategory = (categoryIndex: number, skillIndex: number) => {
    const updated = skills.map((skill, i) => 
      i === categoryIndex 
        ? { ...skill, items: skill.items.filter((_, j) => j !== skillIndex) }
        : skill
    );
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent, categoryIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkillToCategory(categoryIndex);
    }
  };

  const getSkillsForAI = () => {
    return skills.map(category => 
      `${category.category}: ${category.items.join(', ')}`
    ).join('\n');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Code className="text-orange-600" />
          Skills
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => onAISuggestion('skills', getSkillsForAI(), 'skills')}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            AI Suggestions
          </button>
          <button
            onClick={addSkillCategory}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Category
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {skills.map((skillCategory, categoryIndex) => (
          <div key={categoryIndex} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={skillCategory.category}
                onChange={(e) => updateCategory(categoryIndex, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Category name (e.g., Programming Languages, Tools, etc.)"
              />
              <button
                onClick={() => removeSkillCategory(categoryIndex)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {skillCategory.items.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkillFromCategory(categoryIndex, skillIndex)}
                    className="text-orange-600 hover:text-orange-800 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput[categoryIndex] || ''}
                onChange={(e) => setNewSkillInput({ ...newSkillInput, [categoryIndex]: e.target.value })}
                onKeyPress={(e) => handleKeyPress(e, categoryIndex)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add a skill..."
              />
              <button
                onClick={() => addSkillToCategory(categoryIndex)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
        
        {skills.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No skills added yet</p>
            <button
              onClick={addSkillCategory}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Add Your First Skill Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillsForm;