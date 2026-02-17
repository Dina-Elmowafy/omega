export interface ServiceItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string; // Mapping to Lucide icons
  features: string[];
  image?: string;
}

export interface Industry {
  id: string;
  title: string;
  description: string;
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
  description: string;
  icon: string;
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