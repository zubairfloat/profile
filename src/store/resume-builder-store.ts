"use client";

import { useSyncExternalStore } from "react";
import type {
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  ExtraSection,
  PersonalInfo,
  ProjectEntry,
  ResumeData,
  ResumeStore,
  ResumeTemplate,
  SkillCategory,
} from "@/types/resume-builder";

const STORAGE_KEY = "portfolio-resume-builder";
const MAX_STEP = 8;

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  summary: "",
  experience: [],
  projects: [],
  education: [],
  skills: [
    { id: createId("skill"), name: "Frontend", skills: [] },
    { id: createId("skill"), name: "Backend", skills: [] },
    { id: createId("skill"), name: "Database", skills: [] },
    { id: createId("skill"), name: "Cloud", skills: [] },
    { id: createId("skill"), name: "Tools", skills: [] },
  ],
  certifications: [],
  selectedTemplate: "modern-developer",
  currentStep: 0,
  sectionOrder: ["summary", "skills", "experience", "projects", "education", "certifications"],
  theme: {
    accentColor: "#2563eb",
    fontFamily: "Inter",
    borderRadius: 8,
    headerStyle: "classic",
    sidebarWidth: 34,
    paperMargin: 32,
    lineHeight: 1.45,
    showIcons: false,
  },
  extraSections: [],
};

let state: ResumeData = initialResumeData;
const listeners = new Set<() => void>();
let hydrated = false;
let snapshot: ResumeStore | null = null;
let serverSnapshot: ResumeStore | null = null;

function notify() {
  snapshot = { ...state, ...actions };
  listeners.forEach((listener) => listener());
}

function persist() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setState(updater: (current: ResumeData) => ResumeData) {
  state = updater(state);
  persist();
  notify();
}

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved) as Partial<ResumeData>;
    state = {
      ...initialResumeData,
      ...parsed,
      personalInfo: { ...initialResumeData.personalInfo, ...parsed.personalInfo },
      theme: { ...initialResumeData.theme, ...parsed.theme },
      sectionOrder: parsed.sectionOrder ?? initialResumeData.sectionOrder,
      extraSections: parsed.extraSections ?? initialResumeData.extraSections,
    };
    snapshot = { ...state, ...actions };
  } catch {
    state = initialResumeData;
    snapshot = { ...state, ...actions };
  }
}

function createEmptyExperience(): ExperienceEntry {
  return {
    id: createId("exp"),
    company: "",
    jobTitle: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
  };
}

function createEmptyProject(): ProjectEntry {
  return {
    id: createId("project"),
    name: "",
    role: "",
    techStack: "",
    url: "",
    description: "",
    achievements: "",
  };
}

function createEmptyEducation(): EducationEntry {
  return {
    id: createId("education"),
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
    grade: "",
  };
}

function createEmptyCertification(): CertificationEntry {
  return {
    id: createId("cert"),
    name: "",
    issuer: "",
    year: "",
    credentialUrl: "",
  };
}

function createExtraSection(title: string): ExtraSection {
  return {
    id: createId("section"),
    title,
    content: "Add concise, resume-ready details here. Keep it relevant, measurable, and easy to scan.",
  };
}

const actions = {
  updatePersonalInfo(value: Partial<PersonalInfo>) {
    setState((current) => ({
      ...current,
      personalInfo: { ...current.personalInfo, ...value },
    }));
  },
  updateSummary(summary: string) {
    setState((current) => ({ ...current, summary }));
  },
  addExperience() {
    setState((current) => ({ ...current, experience: [...current.experience, createEmptyExperience()] }));
  },
  updateExperience(id: string, value: Partial<ExperienceEntry>) {
    setState((current) => ({
      ...current,
      experience: current.experience.map((entry) => (entry.id === id ? { ...entry, ...value } : entry)),
    }));
  },
  removeExperience(id: string) {
    setState((current) => ({ ...current, experience: current.experience.filter((entry) => entry.id !== id) }));
  },
  addProject() {
    setState((current) => ({ ...current, projects: [...current.projects, createEmptyProject()] }));
  },
  updateProject(id: string, value: Partial<ProjectEntry>) {
    setState((current) => ({
      ...current,
      projects: current.projects.map((entry) => (entry.id === id ? { ...entry, ...value } : entry)),
    }));
  },
  removeProject(id: string) {
    setState((current) => ({ ...current, projects: current.projects.filter((entry) => entry.id !== id) }));
  },
  addEducation() {
    setState((current) => ({ ...current, education: [...current.education, createEmptyEducation()] }));
  },
  updateEducation(id: string, value: Partial<EducationEntry>) {
    setState((current) => ({
      ...current,
      education: current.education.map((entry) => (entry.id === id ? { ...entry, ...value } : entry)),
    }));
  },
  removeEducation(id: string) {
    setState((current) => ({ ...current, education: current.education.filter((entry) => entry.id !== id) }));
  },
  addSkillCategory(name = "New Category") {
    setState((current) => ({
      ...current,
      skills: [...current.skills, { id: createId("skill"), name, skills: [] }],
    }));
  },
  updateSkills(id: string, value: Partial<SkillCategory>) {
    setState((current) => ({
      ...current,
      skills: current.skills.map((entry) => (entry.id === id ? { ...entry, ...value } : entry)),
    }));
  },
  addSkillToCategory(categoryName: string, skill: string) {
    setState((current) => {
      const existing = current.skills.find((category) => category.name.toLowerCase() === categoryName.toLowerCase());
      if (!existing) {
        return {
          ...current,
          skills: [...current.skills, { id: createId("skill"), name: categoryName, skills: [skill] }],
        };
      }

      return {
        ...current,
        skills: current.skills.map((category) =>
          category.id === existing.id && !category.skills.includes(skill)
            ? { ...category, skills: [...category.skills, skill] }
            : category,
        ),
      };
    });
  },
  addCertification() {
    setState((current) => ({ ...current, certifications: [...current.certifications, createEmptyCertification()] }));
  },
  updateCertification(id: string, value: Partial<CertificationEntry>) {
    setState((current) => ({
      ...current,
      certifications: current.certifications.map((entry) => (entry.id === id ? { ...entry, ...value } : entry)),
    }));
  },
  removeCertification(id: string) {
    setState((current) => ({ ...current, certifications: current.certifications.filter((entry) => entry.id !== id) }));
  },
  setTemplate(template: ResumeTemplate) {
    setState((current) => ({ ...current, selectedTemplate: template }));
  },
  updateTheme(value: Partial<ResumeData["theme"]>) {
    setState((current) => ({ ...current, theme: { ...current.theme, ...value } }));
  },
  setSectionOrder(sections: string[]) {
    setState((current) => ({ ...current, sectionOrder: sections }));
  },
  addExtraSection(title: string) {
    setState((current) => ({
      ...current,
      extraSections: [...current.extraSections, createExtraSection(title)],
      sectionOrder: current.sectionOrder.includes(`extra:${title}`)
        ? current.sectionOrder
        : [...current.sectionOrder, `extra:${title}`],
    }));
  },
  updateExtraSection(id: string, value: Partial<ExtraSection>) {
    setState((current) => ({
      ...current,
      extraSections: current.extraSections.map((section) => (section.id === id ? { ...section, ...value } : section)),
    }));
  },
  removeExtraSection(id: string) {
    setState((current) => {
      const section = current.extraSections.find((item) => item.id === id);
      return {
        ...current,
        extraSections: current.extraSections.filter((item) => item.id !== id),
        sectionOrder: section ? current.sectionOrder.filter((item) => item !== `extra:${section.title}`) : current.sectionOrder,
      };
    });
  },
  setCurrentStep(step: number) {
    setState((current) => ({ ...current, currentStep: Math.min(MAX_STEP, Math.max(0, step)) }));
  },
  nextStep() {
    setState((current) => ({ ...current, currentStep: Math.min(MAX_STEP, current.currentStep + 1) }));
  },
  previousStep() {
    setState((current) => ({ ...current, currentStep: Math.max(0, current.currentStep - 1) }));
  },
  resetResume() {
    state = {
      ...initialResumeData,
      skills: initialResumeData.skills.map((category) => ({ ...category, id: createId("skill") })),
    };
    persist();
    notify();
  },
  loadResume(data: ResumeData) {
    setState(() => data);
  },
};

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ResumeStore {
  hydrate();
  if (!snapshot) snapshot = { ...state, ...actions };
  return snapshot;
}

function getServerSnapshot(): ResumeStore {
  if (!serverSnapshot) serverSnapshot = { ...initialResumeData, ...actions };
  return serverSnapshot;
}

export function useResumeBuilderStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
