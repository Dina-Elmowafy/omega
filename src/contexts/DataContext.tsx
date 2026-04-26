import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceItem, InspectionCertificate, LicenseRecord, ProjectUpdate, BlogPost, JobPosition, CompanyInfo, HomePageContent, AboutPageContent } from '../types';
import { api } from '../services/api';

interface DataContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => Promise<void>;
  
  homeContent: HomePageContent;
  updateHomeContent: (content: HomePageContent) => Promise<void>;

  aboutContent: AboutPageContent;
  updateAboutContent: (content: AboutPageContent) => Promise<void>;

  services: ServiceItem[];
  updateServices: (services: ServiceItem[]) => Promise<void>;
  
  certificates: InspectionCertificate[];
  licenses: LicenseRecord[];
  updateCertificates: () => Promise<void>;
  updateLicenses: () => Promise<void>;
  
  projects: ProjectUpdate[];
  blogPosts: BlogPost[];
  jobs: JobPosition[];
  
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({} as CompanyInfo);
  const [homeContent, setHomeContent] = useState<HomePageContent>({} as HomePageContent);
  const [aboutContent, setAboutContent] = useState<AboutPageContent>({} as AboutPageContent);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [certificates, setCertificates] = useState<InspectionCertificate[]>([]);
  const [licenses, setLicenses] = useState<LicenseRecord[]>([]);
  const [projects, setProjects] = useState<ProjectUpdate[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [jobs, setJobs] = useState<JobPosition[]>([]);

  const refreshData = async () => {
    try {
      const [infoData, homeData, aboutData, servicesData, certsData, licensesData, projsData, blogsData, jobsData] = await Promise.all([
        api.company.get(),
        api.homePage.get(),
        api.aboutPage.get(),
        api.services.getAll(),
        api.certificates.getAll(),
        api.licenses.getAll(),
        api.projects.getAll(),
        api.blog.getAll(),
        api.jobs.getAll()
      ]);

      setCompanyInfo(infoData);
      setHomeContent(homeData);
      setAboutContent(aboutData);
      setServices(servicesData);
      setCertificates(certsData);
      setLicenses(licensesData);
      setProjects(projsData);
      setBlogPosts(blogsData);
      setJobs(jobsData);
    } catch (error) { console.error("Failed to fetch data:", error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { refreshData(); }, []);

  const updateCompanyInfo = async (info: CompanyInfo) => { await api.company.update(info); setCompanyInfo(info); };
  const updateHomeContent = async (content: HomePageContent) => { await api.homePage.update(content); await refreshData(); };
  const updateAboutContent = async (content: AboutPageContent) => { await api.aboutPage.update(content); await refreshData(); };
  const updateServices = async (newServices: ServiceItem[]) => { await api.services.update(newServices); setServices(newServices); };
  const updateCertificates = async () => { await refreshData(); };
  const updateLicenses = async () => { await refreshData(); };

  return (
    <DataContext.Provider value={{
      companyInfo, updateCompanyInfo,
      homeContent, updateHomeContent,
      aboutContent, updateAboutContent,
      services, updateServices,
      certificates, licenses, updateCertificates, updateLicenses,
      projects, blogPosts, jobs,
      loading, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};