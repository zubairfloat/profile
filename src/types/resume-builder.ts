export type ResumeTemplate =
  | "modern-developer"
  | "ats-professional"
  | "minimal-clean"
  | "senior-engineer"
  | "enterprise-consultant"
  | "executive"
  | "google-style"
  | "amazon-style"
  | "microsoft-style"
  | "ai-engineer"
  | "modern-ats"
  | "professional-ats"
  | "timeline-resume"
  | "sidebar-resume"
  | "software-engineer"
  | "frontend-developer"
  | "react-developer"
  | "full-stack-developer"
  | "devops-engineer"
  | "minimal-resume";

export type ResumeTheme = {
  accentColor: string;
  fontFamily: "Inter" | "Arial" | "Georgia" | "System";
  borderRadius: number;
  headerStyle: "classic" | "centered" | "sidebar" | "executive";
  sidebarWidth: number;
  paperMargin: number;
  lineHeight: number;
  showIcons: boolean;
};

export type ExtraSection = {
  id: string;
  title: string;
  content: string;
};

export type CareerRole = {
  id: string;
  title: string;
  description: string;
  salaryRange: string;
  skills: string[];
  demandLevel: "High" | "Very High" | "Elite";
};

export type TargetCompany = {
  id: string;
  name: string;
  hiringStyle: string;
  resumePreference: string;
  interviewFocus: string;
};

export type ExperienceLevel = {
  id: string;
  label: string;
  years: string;
  description: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
};

export type ExperienceEntry = {
  id: string;
  company: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  currentlyWorking: boolean;
  description: string;
};

export type ProjectEntry = {
  id: string;
  name: string;
  role: string;
  techStack: string;
  url: string;
  description: string;
  achievements: string;
};

export type EducationEntry = {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade: string;
};

export type SkillCategory = {
  id: string;
  name: string;
  skills: string[];
};

export type CertificationEntry = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialUrl: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  education: EducationEntry[];
  skills: SkillCategory[];
  certifications: CertificationEntry[];
  selectedTemplate: ResumeTemplate;
  currentStep: number;
  targetRole?: string;
  targetCompany?: string;
  experienceLevel?: string;
  atsKeywords?: string[];
  sectionOrder: string[];
  theme: ResumeTheme;
  extraSections: ExtraSection[];
};

export type ResumeStore = ResumeData & {
  updatePersonalInfo: (value: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addExperience: () => void;
  updateExperience: (id: string, value: Partial<ExperienceEntry>) => void;
  removeExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, value: Partial<ProjectEntry>) => void;
  removeProject: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, value: Partial<EducationEntry>) => void;
  removeEducation: (id: string) => void;
  addSkillCategory: (name?: string) => void;
  updateSkills: (id: string, value: Partial<SkillCategory>) => void;
  addSkillToCategory: (categoryName: string, skill: string) => void;
  addCertification: () => void;
  updateCertification: (id: string, value: Partial<CertificationEntry>) => void;
  removeCertification: (id: string) => void;
  setTemplate: (template: ResumeTemplate) => void;
  updateTheme: (value: Partial<ResumeTheme>) => void;
  setSectionOrder: (sections: string[]) => void;
  addExtraSection: (title: string) => void;
  updateExtraSection: (id: string, value: Partial<ExtraSection>) => void;
  removeExtraSection: (id: string) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  resetResume: () => void;
  loadResume: (data: ResumeData) => void;
};
