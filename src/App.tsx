import React, { useState, useRef } from 'react';
import { FileText, Download, Eye, Save, Sparkles } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import PersonalInfoForm from './components/PersonalInfoForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import SkillsForm from './components/SkillsForm';
import ProjectsForm from './components/ProjectsForm';
import CertificationsForm from './components/CertificationsForm';
import ResumePreview from './components/ResumePreview';
import AISuggestionModal from './components/AISuggestionModal';
import { Resume, PersonalInfo, Experience, Education, SkillCategory, Project } from './types/resume';

const API_BASE_URL = 'http://localhost:4000/api';

function App() {
  const [resume, setResume] = useState<Resume>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      portfolio: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [pendingSuggestion, setPendingSuggestion] = useState<{
    type: string;
    field: string;
    index?: number;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'skills', name: 'Skills', icon: '⚡' },
    { id: 'projects', name: 'Projects', icon: '🚀' },
    { id: 'certifications', name: 'Certifications', icon: '🏆' },
  ];

  const handlePersonalInfoChange = (personalInfo: PersonalInfo) => {
    setResume({ ...resume, personalInfo });
  };

  const handleExperienceChange = (experience: Experience[]) => {
    setResume({ ...resume, experience });
  };

  const handleEducationChange = (education: Education[]) => {
    setResume({ ...resume, education });
  };

  const handleSkillsChange = (skills: SkillCategory[]) => {
    setResume({ ...resume, skills });
  };

  const handleProjectsChange = (projects: Project[]) => {
    setResume({ ...resume, projects });
  };

  const handleCertificationsChange = (certifications: string[]) => {
    setResume({ ...resume, certifications });
  };

  const handleAISuggestion = async (type: string, content: string, field: string, index?: number) => {
    setIsLoadingAI(true);
    setIsAIModalOpen(true);
    setPendingSuggestion({ type, field, index });

    try {
      const response = await fetch(`${API_BASE_URL}/ai-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          content,
          context: getContextForAI(type)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAISuggestion(data.suggestion);
      } else {
        setAISuggestion('Sorry, unable to generate suggestions at the moment.');
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      setAISuggestion('Error connecting to AI service. Please try again later.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getContextForAI = (type: string) => {
    switch (type) {
      case 'summary':
        return resume.experience.length > 0 ? resume.experience[0].jobTitle : 'Professional';
      case 'experience':
        return 'Professional experience';
      case 'skills':
        return resume.experience.length > 0 ? resume.experience[0].company : 'Technology professional';
      default:
        return 'Professional';
    }
  };

  const applyAISuggestion = () => {
    if (!pendingSuggestion || !aiSuggestion) return;

    const { type, field, index } = pendingSuggestion;

    if (type === 'summary') {
      setResume({
        ...resume,
        personalInfo: { ...resume.personalInfo, summary: aiSuggestion }
      });
    } else if (type === 'experience' && index !== undefined) {
      const updatedExperience = resume.experience.map((exp, i) =>
        i === index ? { ...exp, description: aiSuggestion } : exp
      );
      setResume({ ...resume, experience: updatedExperience });
    }

    setIsAIModalOpen(false);
    setPendingSuggestion(null);
    setAISuggestion('');
  };

  const saveResume = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        const savedResume = await response.json();
        setResume(savedResume);
        alert('Resume saved successfully!');
      } else {
        alert('Error saving resume. Please try again.');
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Error saving resume. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`${resume.personalInfo.fullName || 'Resume'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <PersonalInfoForm
            personalInfo={resume.personalInfo}
            onChange={handlePersonalInfoChange}
            onAISuggestion={handleAISuggestion}
          />
        );
      case 'experience':
        return (
          <ExperienceForm
            experience={resume.experience}
            onChange={handleExperienceChange}
            onAISuggestion={handleAISuggestion}
          />
        );
      case 'education':
        return (
          <EducationForm
            education={resume.education}
            onChange={handleEducationChange}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            skills={resume.skills}
            onChange={handleSkillsChange}
            onAISuggestion={handleAISuggestion}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            projects={resume.projects}
            onChange={handleProjectsChange}
          />
        );
      case 'certifications':
        return (
          <CertificationsForm
            certifications={resume.certifications}
            onChange={handleCertificationsChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Resume Builder</h1>
                <p className="text-sm text-gray-600">AI-Powered Professional Resume Generator</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showPreview 
                    ? 'bg-blue-600 text-white' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                onClick={saveResume}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Resume'}
              </button>
              
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`grid ${showPreview ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
          {/* Form Section */}
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-lg p-2">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="hidden sm:block">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Content */}
            {renderTabContent()}
          </div>

          {/* Preview Section */}
          {showPreview && (
            <div className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Live Preview</h2>
                  <button
                    onClick={generatePDF}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-auto max-h-[80vh]">
                  <ResumePreview ref={previewRef} resume={resume} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Suggestion Modal */}
      <AISuggestionModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        suggestion={aiSuggestion}
        isLoading={isLoadingAI}
        onApply={applyAISuggestion}
      />
    </div>
  );
}

export default App;