import React, { createContext, useContext, useState, useEffect } from 'react';
import { ServiceItem, InspectionCertificate, ProjectUpdate, BlogPost, JobPosition, CompanyInfo } from '../types';
import { api } from '../services/api';

interface DataContextType {
  companyInfo: CompanyInfo;
  updateCompanyInfo: (info: CompanyInfo) => Promise<void>;
  services: ServiceItem[];
  updateServices: (services: ServiceItem[]) => Promise<void>;
  certificates: InspectionCertificate[];
  updateCertificates: (certs: InspectionCertificate[]) => Promise<void>;
  projects: ProjectUpdate[];
  updateProjects: (projects: ProjectUpdate[]) => Promise<void>;
  blogPosts: BlogPost[];
  addBlogPost: (post: BlogPost) => Promise<void>;
  jobs: JobPosition[];
  addJob: (job: JobPosition) => Promise<void>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  // State
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({} as CompanyInfo);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [certificates, setCertificates] = useState<InspectionCertificate[]>([]);
  const [projects, setProjects] = useState<ProjectUpdate[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [jobs, setJobs] = useState<JobPosition[]>([]);

  const refreshData = async () => {
    try {
      const [infoData, servicesData, certsData, projectsData, blogData, jobsData] = await Promise.all([
        api.company.get(),
        api.services.getAll(),
        api.certificates.getAll(),
        api.projects.getAll(),
        api.blog.getAll(),
        api.jobs.getAll()
      ]);

      setCompanyInfo(infoData);
      setServices(servicesData);
      setCertificates(certsData);
      setProjects(projectsData);
      setBlogPosts(blogData);
      setJobs(jobsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Update Wrappers
  const updateCompanyInfo = async (info: CompanyInfo) => {
    await api.company.update(info);
    setCompanyInfo(info);
  };

  const updateServices = async (newServices: ServiceItem[]) => {
    await api.services.update(newServices);
    setServices(newServices);
  };

  const updateCertificates = async (certs: InspectionCertificate[]) => {
    await api.certificates.update(certs);
    setCertificates(certs);
  };

  const updateProjects = async (projs: ProjectUpdate[]) => {
    await api.projects.update(projs);
    setProjects(projs);
  };

  const addBlogPost = async (post: BlogPost) => {
    await api.blog.create(post);
    setBlogPosts(prev => [post, ...prev]);
  };

  const addJob = async (job: JobPosition) => {
    // Add API call here if needed
    setJobs(prev => [job, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      companyInfo,
      updateCompanyInfo,
      services,
      updateServices,
      certificates,
      updateCertificates,
      projects,
      updateProjects,
      blogPosts,
      addBlogPost,
      jobs,
      addJob,
      loading,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};