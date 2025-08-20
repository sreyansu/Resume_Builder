import React, { useState } from 'react';
import { Folder, Plus, Trash2, X } from 'lucide-react';
import { Project } from '../types/resume';

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({ projects, onChange }) => {
  const [newTechInput, setNewTechInput] = useState<{ [key: number]: string }>({});

  const addProject = () => {
    onChange([
      ...projects,
      {
        name: '',
        description: '',
        technologies: [],
        link: ''
      }
    ]);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = projects.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  const addTechnology = (projectIndex: number) => {
    const techText = newTechInput[projectIndex]?.trim();
    if (!techText) return;

    const updated = projects.map((project, i) => 
      i === projectIndex 
        ? { ...project, technologies: [...project.technologies, techText] }
        : project
    );
    onChange(updated);
    setNewTechInput({ ...newTechInput, [projectIndex]: '' });
  };

  const removeTechnology = (projectIndex: number, techIndex: number) => {
    const updated = projects.map((project, i) => 
      i === projectIndex 
        ? { ...project, technologies: project.technologies.filter((_, j) => j !== techIndex) }
        : project
    );
    onChange(updated);
  };

  const handleKeyPress = (e: React.KeyboardEvent, projectIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology(projectIndex);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Folder className="text-indigo-600" />
          Projects
        </h2>
        <button
          onClick={addProject}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Project #{index + 1}
              </h3>
              <button
                onClick={() => removeProject(index)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="E-commerce Website"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Link
                </label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                placeholder="Developed a full-stack e-commerce platform with user authentication, payment processing, and admin dashboard..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {project.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => removeTechnology(index, techIndex)}
                      className="text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechInput[index] || ''}
                  onChange={(e) => setNewTechInput({ ...newTechInput, [index]: e.target.value })}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Add a technology..."
                />
                <button
                  onClick={() => addTechnology(index)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No projects added yet</p>
            <button
              onClick={addProject}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsForm;