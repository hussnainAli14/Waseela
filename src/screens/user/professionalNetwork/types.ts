export type IndustryValue =
  | 'all'
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'education';

export type IndustryOption = {
  label: string;
  value: IndustryValue;
};

export type Professional = {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: IndustryValue;
  city: string;
  yearsExperience: number;
  tags: string[];
  avatar: string;
  offeringMentorship: boolean;
  about?: string;
  expertise?: string[];
  helpTitle?: string;
  helpDescription?: string;
  linkedinUrl?: string;
};


