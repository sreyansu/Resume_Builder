import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Resume Schema
const resumeSchema = new mongoose.Schema({
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    location: String,
    linkedin: String,
    portfolio: String,
    summary: String
  },
  experience: [{
    jobTitle: String,
    company: String,
    location: String,
    startDate: String,
    endDate: String,
    currentJob: Boolean,
    description: String
  }],
  education: [{
    degree: String,
    school: String,
    location: String,
    startDate: String,
    endDate: String,
    gpa: String
  }],
  skills: [{
    category: String,
    items: [String]
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  certifications: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Resume = mongoose.model('Resume', resumeSchema);

// OpenAI configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.warn('Warning: OPENAI_API_KEY is not set. AI suggestions will fail.');
}

// Routes
app.get('/api/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/resumes', async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Suggestions endpoint
app.post('/api/ai-suggestions', async (req, res) => {
  try {
    const { type, content, context } = req.body;
    
    let prompt = '';
    
    switch (type) {
      case 'summary':
        prompt = `As a professional resume writer, improve this professional summary for a resume. Make it more compelling, specific, and tailored to the industry. Keep it concise (2-3 sentences max):

Original: ${content}

Context: ${context || 'General professional'}

Provide an improved version:`;
        break;
        
      case 'experience':
        prompt = `As a professional resume writer, improve this job experience description. Make it more impactful using action verbs, quantifiable achievements, and relevant keywords. Format as bullet points:

Original: ${content}

Context: ${context || 'Professional role'}

Provide improved bullet points:`;
        break;
        
      case 'skills':
        prompt = `As a professional resume writer, suggest additional relevant skills for this professional based on their background. Current skills: ${content}

Context: ${context || 'General professional'}

Suggest 5-8 additional relevant skills they might have:`;
        break;
        
      default:
        return res.status(400).json({ error: 'Invalid suggestion type' });
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      // Use a current, available model
      model: 'gpt-4o-mini',
      max_tokens: 300,
      temperature: 0.7,
    });

    const suggestion = completion.choices[0].message.content.trim();
    res.json({ suggestion });
  } catch (error) {
    console.error('OpenAI API error:', error);
    const message = (error && (error.message || error?.response?.data?.error?.message)) || 'Failed to generate AI suggestions';
    res.status(500).json({ error: message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});