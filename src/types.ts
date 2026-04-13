export interface ServiceItem {
  id: string;
  title: string;
  titleAr?: string;
  shortDescription: string;
  shortDescriptionAr?: string;
  fullDescription: string;
  fullDescriptionAr?: string;
  iconName: string;
  features: string[];
  featuresAr?: string[];
  image?: string;
}

export interface Industry {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  image: string;
}

export interface User {
  id: string;
  name: string;
  companyName: string;
  role: 'admin' | 'client' | 'staff';
  email: string;
  avatar?: string;
}

export interface InspectionCertificate {
  id: string;
  equipmentName: string;
  serialNumber: string;
  inspectionDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  pdfUrl: string;
  clientId?: string; 
  companyName?: string;
}

export interface ProjectStage {
  name: string;
  status: 'pending' | 'active' | 'completed';
  date?: string;
}

export interface ProjectUpdate {
  id: string;
  title: string;
  progress: number;
  status: string;
  lastUpdated: string;
  stages: ProjectStage[];
  clientId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface WhyChooseUsItem {
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  icon?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
}

export interface JobPosition {
  id: string;
  title: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract';
  description: string;
  requirements: string[];
}

export interface CompanyInfo {
  name: string;
  fullName: string;
  slogan: string;
  established: number;
  location: string;
  phone: string;
  email: string;
  website: string;
  whatsapp: string;
  address: string;
  mission: string;
  vision: string;
}

export interface StatItem {
  label: string;
  labelAr?: string;
  val: string;
}

export interface HomePageContent {
  heroTitle: string;
  heroTitleAr?: string;
  heroHighlight: string;
  heroHighlightAr?: string;
  heroSubtitle: string;
  heroSubtitleAr?: string;
  heroImage: string;
  
  stats: StatItem[];
  
  industriesTitle?: string;
  industriesTitleAr?: string;
  industriesSubtitle?: string;
  industriesSubtitleAr?: string;
  industries?: Industry[];
  
  whyChooseUsTitle?: string;
  whyChooseUsTitleAr?: string;
  whyChooseUsImage?: string;
  whyChooseUsItems?: WhyChooseUsItem[];
}

export interface AboutPageContent {
  title: string;
  titleAr?: string;
  subtitle: string;
  subtitleAr?: string;
  story: string;
  storyAr?: string;
  mission: string;
  missionAr?: string;
  vision: string;
  visionAr?: string;
  coverImage: string;
}