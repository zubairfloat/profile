export type NetworkingSectionId =
  | "global-networking"
  | "vpc-vpn-gateways"
  | "subnets-firewalls"
  | "edge-networking"
  | "connectivity";

export type KnowledgeCheck = {
  question: string;
  answer: string;
};

export type NetworkingTopic = {
  id: string;
  sectionId: NetworkingSectionId;
  name: string;
  category: string;
  definition: string;
  why: string;
  how: string;
  analogy: string;
  useCase: string;
  architecture: string[];
  examTip: string;
  checks: KnowledgeCheck[];
};

export type NetworkingSection = {
  id: NetworkingSectionId;
  title: string;
  intro: string;
};

export type ServiceComparison = {
  id: string;
  title: string;
  columns: string[];
  rows: string[][];
};

export type QuizOption = {
  id: string;
  text: string;
  whyIncorrect?: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
  relatedService: string;
  examKeyword: string;
};

export type CheatSheetItem = {
  term: string;
  definition: string;
};
