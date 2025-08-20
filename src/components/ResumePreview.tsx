import React, { forwardRef } from 'react';
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { Resume } from '../types/resume';

interface ResumePreviewProps {
  resume: Resume;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume }, ref) => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    return (
      <div 
        ref={ref}
        className="bg-white shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto print:shadow-none print:max-w-none"
        style={{ minHeight: '11in', fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 print:bg-blue-600">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">{resume.personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {resume.personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {resume.personalInfo.email}
                </div>
              )}
              {resume.personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {resume.personalInfo.phone}
                </div>
              )}
              {resume.personalInfo.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {resume.personalInfo.location}
                </div>
              )}
              {resume.personalInfo.linkedin && (
                <div className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </div>
              )}
              {resume.personalInfo.portfolio && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Portfolio
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Summary */}
          {resume.personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{resume.personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {resume.experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
                Professional Experience
              </h2>
              {resume.experience.map((exp, index) => (
                <div key={index} className="mb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{exp.jobTitle}</h3>
                      <p className="text-lg text-blue-600 font-medium">{exp.company}</p>
                      {exp.location && <p className="text-gray-600">{exp.location}</p>}
                    </div>
                    <div className="text-right text-gray-600">
                      {exp.startDate && (
                        <p>
                          {formatDate(exp.startDate)} - {exp.currentJob ? 'Present' : formatDate(exp.endDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 ml-4">
                      {exp.description.split('\n').map((line, lineIndex) => (
                        <p key={lineIndex} className="mb-1">
                          {line.trim().startsWith('•') ? line : `• ${line}`}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
                Education
              </h2>
              {resume.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{edu.degree}</h3>
                      <p className="text-blue-600 font-medium">{edu.school}</p>
                      {edu.location && <p className="text-gray-600">{edu.location}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-gray-600">
                      {edu.startDate && edu.endDate && (
                        <p>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
                Skills
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resume.skills.map((skillCategory, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-800 mb-2">{skillCategory.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillCategory.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
                Projects
              </h2>
              {resume.projects.map((project, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a href={project.link} className="text-blue-600 hover:underline text-sm">
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
                Certifications
              </h2>
              <ul className="list-disc list-inside text-gray-700">
                {resume.certifications.map((cert, index) => (
                  <li key={index} className="mb-1">{cert}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    );
  }
);

ResumePreview.displayName = 'ResumePreview';

export default ResumePreview;